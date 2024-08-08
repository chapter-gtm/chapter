# tf/modules/ecs/variables.tf

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
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "ecs_task_execution_role" {
  description = "IAM role for ECS task execution"
  type        = string
}

variable "ecs_task_role" {
  description = "IAM role for ECS task"
  type        = string
}

variable "alb_target_group_arn" {
  description = "ALB target group ARN"
  type        = string
}

variable "security_groups" {
  description = "Security groups for ECS tasks"
  type        = list(string)
}

variable "ecs_task_definition_json" {
  description = "ECS task definition json"
  type        = string
}
