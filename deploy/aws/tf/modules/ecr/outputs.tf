# tf/modules/ecr/outputs.tf

output "repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.app_repository.repository_url
}
