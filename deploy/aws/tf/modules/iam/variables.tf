# tf/modules/iam/variables.tf

variable "app_name" {
  description = "App name"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "app_bucket_name" {
  description = "App's s3 bucket"
  type        = string
}

variable "rds_db_id" {
  description = "RDS database ID"
  type        = string
}

variable "cloudwatch_log_group_name" {
  description = "Cloudwatch log group name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in the format 'owner/repo'"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to allow access"
  type        = string
  default     = "main"
}
