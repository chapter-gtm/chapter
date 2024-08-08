# tf/modules/jumpbox/main.tf

data "aws_ami" "aws_linux" {
  most_recent = true
  owners      = ["137112412989"] # Amazon

  filter {
    name   = "name"
    values = ["al2023-ami-2023.5.20240805.0-kernel-6.1-x86_64"]
  }
}

resource "aws_instance" "ec2_jumpbox" {
  ami                    = data.aws_ami.aws_linux.id
  instance_type          = "t3.micro"
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = var.security_group_ids
  key_name               = var.ec2_key_pair_name
  associate_public_ip_address = true

  tags = {
    Name = "${var.app_name}-ec2-jumpbox-${var.environment}"
    Environment = var.environment
  }

  depends_on = [var.vpc_id, var.public_subnet_id]
}

# Allocate an Elastic IP
resource "aws_eip" "ec2_jumpbox_eip" {
  depends_on = [aws_instance.ec2_jumpbox]
}

# Associate the Elastic IP with the EC2 instance
resource "aws_eip_association" "ec2_jumpbox_eip_assoc" {
  instance_id   = aws_instance.ec2_jumpbox.id
  allocation_id = aws_eip.ec2_jumpbox_eip.id
  depends_on = [aws_instance.ec2_jumpbox, aws_eip.ec2_jumpbox_eip]
}
