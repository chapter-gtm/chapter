# tf/modules/cloudwatch/main.tf

resource "aws_cloudwatch_log_group" "app_log_group" {
  name              = "/ecs/${var.app_name}-app-${var.environment}"
  retention_in_days = 7

  tags = {
    Name = "${var.app_name}-log-group-${var.environment}"
    Env  = var.environment
  }
}
