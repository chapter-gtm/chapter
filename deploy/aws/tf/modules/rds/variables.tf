# tf/modules/rds/variables.tf

variable "app_name" {
  description = "App name"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnets" {
  description = "Private subnet IDs for RDS"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs for RDS"
  type        = list(string)
}

variable "app_db_user" {
  description = "App database user"
  type        = string
}

variable "app_db_name" {
  description = "App database name"
  type        = string
}
