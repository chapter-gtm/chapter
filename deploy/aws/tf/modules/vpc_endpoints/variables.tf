# terraform/modules/vpc_endpoints/variables.tf

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

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnets" {
  description = "Private subnet IDs for VPC endpoints"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs for VPC endpoints"
  type        = list(string)
}

variable "public_route_table_ids" {
  description = "Public route table IDs"
  type        = list(string)
}
