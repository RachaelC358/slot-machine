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

resource "aws_ecs_cluster" "slot_machine_cluster" {
  name = "slot-machine-cluster"
}

resource "aws_ecs_task_definition" "slot_machine_task" {
  family                   = "slot-machine-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::307946634710:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS"
  task_role_arn            = "arn:aws:iam::307946634710:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS"

  container_definitions = jsonencode([ 
    {
      name      = "slot-machine-container"
      image     = "307946634710.dkr.ecr.us-east-1.amazonaws.com/slot-machine:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

data "aws_ssm_parameter" "ecs_ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id"
}

# EC2 instance resource
resource "aws_instance" "ecs_instance_slots" {
  ami                    = data.aws_ssm_parameter.ecs_ami.value
  instance_type          = "t2.micro"
  key_name               = "rachael-key-pair"
  subnet_id              = "subnet-0c818649d0f34da8c"  # Make sure this is correct
  security_groups        = [aws_security_group.ecs_sg.id]  # Use security group ID here

  iam_instance_profile   = aws_iam_instance_profile.ecs_instance_profile.name

  tags = {
    Name = "ECS-Instance"
  }

  depends_on = [aws_security_group.ecs_sg]
}

resource "aws_security_group" "ecs_sg" {
  name        = "ecs-sg"
  description = "Allow inbound HTTP traffic to ECS container"

  ingress {
    from_port   = 80
    to_port     = 80
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

# Create IAM Role for EC2 instances to use ECS
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

# Create IAM Instance Profile for EC2 instances
resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecsInstanceProfile"
  role = aws_iam_role.ecs_instance_role.name
}

# Attach policies to the ECS instance role
resource "aws_iam_role_policy_attachment" "ecs_instance_role_policy" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"  # Correct ARN
}

#update ecs with built docker image on git push
resource "aws_ecs_service" "slot_machine_service" {
  name            = "slot-machine-service"
  cluster         = aws_ecs_cluster.slot_machine_cluster.id
  task_definition = aws_ecs_task_definition.slot_machine_task.arn
  desired_count   = 1
  launch_type     = "EC2"
  
  depends_on = [aws_ecs_task_definition.slot_machine_task]
}

resource "aws_eip" "ecs_instance_eip" {
  instance = aws_instance.ecs_instance_slots.id
  domain   = "vpc"
}

output "elastic_ip" {
  description = "The public Elastic IP of the ECS instance"
  value       = aws_eip.ecs_instance_eip.public_ip
}

