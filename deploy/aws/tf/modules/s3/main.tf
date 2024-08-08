# tf/modules/s3/main.tf

resource "aws_s3_bucket" "app_bucket" {
  bucket = "${var.app_name}-bucket-${var.environment}"

  tags = {
    Name        = "${var.app_name}-bucket-${var.environment}"
    Environment = var.environment
  }
}
