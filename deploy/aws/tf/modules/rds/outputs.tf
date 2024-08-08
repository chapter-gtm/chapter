# tf/modules/rds/outputs.tf

output "rds_db_id" {
  description = "Identifier of the RDS instance"
  value       = aws_db_instance.app_db.identifier
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.app_db.endpoint
}
