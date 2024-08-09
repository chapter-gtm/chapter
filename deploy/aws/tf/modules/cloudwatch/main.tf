# tf/modules/cloudwatch/main.tf

resource "aws_cloudwatch_log_group" "app_log_group" {
  name              = "/ecs/${var.app_name}-app-${var.environment}"
  retention_in_days = 7

  tags = {
    Name = "${var.app_name}-app-log-group-${var.environment}"
    Env  = var.environment
  }
}

resource "aws_cloudwatch_log_group" "db_migrator_log_group" {
  name              = "/ecs/${var.app_name}-db-migrator-${var.environment}"
  retention_in_days = 7

  tags = {
    Name = "${var.app_name}-db-migrator-log-group-${var.environment}"
    Env  = var.environment
  }
}

resource "aws_cloudwatch_log_group" "worker_log_group" {
  name              = "/ecs/${var.app_name}-worker-${var.environment}"
  retention_in_days = 7

  tags = {
    Name = "${var.app_name}-worker-log-group-${var.environment}"
    Env  = var.environment
  }
}
