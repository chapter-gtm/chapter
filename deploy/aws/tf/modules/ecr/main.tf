# tf/modules/ecr/main.tf

resource "aws_ecr_repository" "app_repository" {
  name = "${var.app_name}-repository-${var.environment}"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.app_name}-repository-${var.environment}"
    Environment = var.environment
  }
}
