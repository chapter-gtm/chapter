# tf/modules/iam/main.tf
 
resource "aws_iam_openid_connect_provider" "github_actions" {
  url                   = "https://token.actions.githubusercontent.com"
  client_id_list        = ["sts.amazonaws.com"]
  thumbprint_list       = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {
    Name = "GitHub Actions OIDC Provider"
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceRole"
  ]

  inline_policy {
    name = "${var.app_name}-ecs-task-outbound-access-policy-${var.environment}"
    policy = jsonencode({
      Version = "2012-10-17",
      Statement = [
        {
          Effect   = "Allow",
          Action   = ["ssm:GetParameters", "ssm:GetParameter"],
          Resource = "arn:aws:ssm:${var.region}:${var.aws_account_id}:parameter/${var.app_name}/${var.environment}/*"
        },
        {
          Effect   = "Allow",
          Action   = ["secretsmanager:GetSecretValue"],
          Resource = var.rds_db_secret_arn
        },
      ]
    })
  }

}

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.app_name}-ecs-task-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  ]

  inline_policy {
    name = "${var.app_name}-ecs-task-outbound-access-policy-${var.environment}"
    policy = jsonencode({
      Version = "2012-10-17",
      Statement = [
        {
          Effect   = "Allow",
          Action   = ["s3:ListBucket", "s3:GetObject"],
          Resource = "arn:aws:s3:::${var.app_bucket_name}/*"
        },
        {
          Effect   = "Allow",
          Action   = ["rds:Connect"],
          Resource = "arn:aws:rds:${var.region}:${var.aws_account_id}:db:${var.rds_db_id}"
        },
        {
          Effect   = "Allow",
          Action   = ["elasticache:DescribeCacheClusters"],
          Resource = "*"
        },
        {
          Effect   = "Allow",
          Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
          Resource = "arn:aws:logs:${var.region}:${var.aws_account_id}:log-group:/ecs/${var.app_name}*:*"
        }
      ]
    })
  }
}

# Define the IAM Role with OIDC trust policy
resource "aws_iam_role" "github_actions_role" {
  name = "${var.app_name}-github-actions-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = "arn:aws:iam::${var.aws_account_id}:oidc-provider/token.actions.githubusercontent.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" : "repo:${var.github_repo}:*"
          },
          "ForAllValues:StringEquals": {
              "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
              "token.actions.githubusercontent.com:iss": "https://token.actions.githubusercontent.com"
          }
        }
      }
    ]
  })
}

# Define IAM Policy for ECS and ECR permissions
resource "aws_iam_policy" "github_actions_policy" {
  name = "${var.app_name}-github-actions-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:BatchCheckLayerAvailability",
          "ecs:UpdateService",
          "ecs:DescribeServices",
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "iam:PassRole"
        ],
        Resource = [
          "${aws_iam_role.ecs_task_execution_role.arn}",
          "${aws_iam_role.ecs_task_role.arn}"
        ]
      }
    ]
  })
}

# Attach the policy to the role
resource "aws_iam_role_policy_attachment" "attach_github_actions_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_policy.arn
}
