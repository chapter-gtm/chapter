# tf/modules/ecs/main.tf

resource "aws_ecs_cluster" "app_cluster" {
  name = "${var.app_name}-cluster-${var.environment}"
}

resource "aws_ecs_task_definition" "app_task" {
  family                = jsondecode(var.ecs_task_definition_json).family
  network_mode          = jsondecode(var.ecs_task_definition_json).networkMode
  requires_compatibilities = jsondecode(var.ecs_task_definition_json).requiresCompatibilities
  cpu                   = jsondecode(var.ecs_task_definition_json).cpu
  memory                = jsondecode(var.ecs_task_definition_json).memory
  execution_role_arn    = var.ecs_task_execution_role
  task_role_arn         = var.ecs_task_role
  container_definitions = jsonencode(jsondecode(var.ecs_task_definition_json).containerDefinitions)
}

resource "aws_ecs_service" "app_service" {
  name            = "${var.app_name}-service-${var.environment}"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = var.private_subnets
    security_groups = var.security_groups
    assign_public_ip = false
  }
  load_balancer {
    target_group_arn = var.alb_target_group_arn
    container_name   = "app"
    container_port   = 8000
  }
}
