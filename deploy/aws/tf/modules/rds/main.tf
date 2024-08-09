# tf/modules/rds/main.tf

resource "aws_db_subnet_group" "app_db_subnet_group" {
  name       = "${var.app_name}-db-subnet-group-${var.environment}"
  subnet_ids = var.private_subnets

  tags = {
    Name = "${var.app_name}-db-subnet-group-${var.environment}"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}

resource "random_password" "app_db_password" {
  length  = 16
  special = true
}

resource "aws_secretsmanager_secret" "app_db_password" {
  name        = "${var.app_name}-db-password-${var.environment}"
  description = "The RDS database password"
}

resource "aws_secretsmanager_secret_version" "app_db_password_version" {
  secret_id     = aws_secretsmanager_secret.app_db_password.id
  secret_string = jsonencode({
    username = var.app_db_user
    password = random_password.app_db_password.result
    port     = 5432
    dbname   = var.app_db_name
  })
  depends_on = [aws_secretsmanager_secret.app_db_password, random_password.app_db_password]
}

data "aws_secretsmanager_secret_version" "app_db_password_version_data" {
  secret_id = aws_secretsmanager_secret.app_db_password.id
  depends_on = [aws_secretsmanager_secret.app_db_password, aws_secretsmanager_secret_version.app_db_password_version]
}

resource "aws_db_instance" "app_db" {
  identifier              = "${var.app_name}-db-${var.environment}"
  engine                  = "postgres"
  instance_class          = "db.t4g.micro"
  allocated_storage       = 20
  storage_type            = "gp2"
  username                = var.app_db_user
  password                = jsondecode(data.aws_secretsmanager_secret_version.app_db_password_version_data.secret_string).password
  db_subnet_group_name    = aws_db_subnet_group.app_db_subnet_group.name
  vpc_security_group_ids  = var.security_group_ids

  skip_final_snapshot     = true

  backup_retention_period = 7  # Retain backups for 7 days
  backup_window            = "05:00-06:00"  # Define a backup window (optional)
  maintenance_window       = "Sun:07:00-Sun:13:00"  # Define a maintenance window (optional)

  tags = {
    Name = "${var.app_name}-db-${var.environment}"
    Enviorment = var.environment
  }

  provisioner "local-exec" {
    command = <<EOT
      PGPASSWORD="${jsondecode(data.aws_secretsmanager_secret_version.app_db_password_version_data.secret_string).password}" psql -h ${self.address} -U ${var.app_db_user} -c "CREATE DATABASE ${var.db_name};"
    EOT
    environment = {
      PGPASSWORD = jsondecode(data.aws_secretsmanager_secret_version.app_db_password_version_data.secret_string).password
    }
  }

  depends_on = [var.vpc_id, aws_secretsmanager_secret.app_db_password, aws_secretsmanager_secret_version.app_db_password_version_data]
}

# TODO: Append dbname to secretsmanager
