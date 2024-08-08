# tf/modules/ecr/main.tf

resource "aws_ecr_repository" "app_repository" {
  name = "${var.app_name}-app-repository-${var.environment}"

  tags = {
    Name = "${var.app_name}-app-repository-${var.environment}"
    Environment = var.environment
  }
}
