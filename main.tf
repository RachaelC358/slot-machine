terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Data source for retrieving the ECS AMI from AWS SSM Parameter Store
data "aws_ssm_parameter" "ecs_ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id"
}

# ECS Cluster
resource "aws_ecs_cluster" "slot_machine_cluster" {
  name = "slot-machine-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "slot_machine_task" {
  family                   = "slot-machine-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::307946634710:role/execution"
  task_role_arn            = "arn:aws:iam::307946634710:role/todd"

  container_definitions = jsonencode([
    {
      name      = "slot-machine-container"
      image     = "307946634710.dkr.ecr.us-east-1.amazonaws.com/slot-machine:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 8080  # Change hostPort to avoid conflict
        }
      ]
    }
  ])
}

resource "aws_iam_role_policy_attachment" "ecs_task_cloudwatch_policy" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}


# EC2 instance resource
resource "aws_instance" "ecs_instance_slots" {
  ami                    = data.aws_ssm_parameter.ecs_ami.value
  instance_type          = "t2.medium"
  key_name               = "rachael-key-pair"
  subnet_id              = "subnet-0c818649d0f34da8c"
  security_groups        = [aws_security_group.ecs_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ecs_instance_profile.name

user_data = <<-EOF
              #!/bin/bash
              echo "ECS_CLUSTER=slot-machine-cluster" > /etc/ecs/ecs.config
              systemctl enable --now ecs
              echo "ECS agent started"
            EOF


  tags = {
    Name = "ECS-Instance"
  }

  depends_on = [aws_security_group.ecs_sg]
}

# Security Group for ECS Instance
resource "aws_security_group" "ecs_sg" {
  name        = "ecs-sg"
  description = "Allow inbound HTTP traffic to ECS container"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}



# Adding this managed policy for ECS agent access to the ECS API
resource "aws_iam_role_policy_attachment" "ecs_agent_access" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceRole"
}


# IAM Role for ECS Instance
resource "aws_iam_role" "ecs_instance_role" {
  name = "ecsInstanceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Effect    = "Allow"
        Sid       = ""
      },
    ]
  })
}

# IAM Instance Profile for EC2 Instances
resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecsInstanceProfile"
  role = aws_iam_role.ecs_instance_role.name
}

# Attach Policies to ECS Instance Role
resource "aws_iam_role_policy_attachment" "ecs_instance_role_policy" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

# ECS Service to run task
resource "aws_ecs_service" "slot_machine_service" {
  name            = "slot-machine-service"
  cluster         = aws_ecs_cluster.slot_machine_cluster.id
  task_definition = aws_ecs_task_definition.slot_machine_task.arn
  desired_count   = 1
  launch_type     = "EC2"
  
  depends_on = [aws_ecs_task_definition.slot_machine_task]
}

# Elastic IP for the ECS Instance
resource "aws_eip" "ecs_instance_eip" {
  instance = aws_instance.ecs_instance_slots.id
  domain   = "vpc"
}

output "elastic_ip" {
  description = "The public Elastic IP of the ECS instance"
  value       = aws_eip.ecs_instance_eip.public_ip
}
