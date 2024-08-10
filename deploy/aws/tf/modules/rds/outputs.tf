# tf/modules/rds/outputs.tf

output "rds_db_id" {
  description = "Identifier of the RDS instance"
  value       = aws_db_instance.app_db.identifier
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.app_db.endpoint
}

output "rds_db_secret_arn" {
  description = "RDS database secret arn"
  value       = aws_secretsmanager_secret.app_db_password.arn
}
