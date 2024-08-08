# tf/modules/cloudwatch/outputs.tf

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch Log Group"
  value       = aws_cloudwatch_log_group.app_log_group.name
}
