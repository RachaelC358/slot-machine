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

resource "aws_ecs_cluster" "slot_machine_cluster" {     #resource type and name in terraform
  name = "slot-machine-cluster"                         #actual name of the cluster in aws 
}

resource "aws_ecs_task_definition" "slot_machine_task" {     #tell ecs to run the docker container
  family                   = "slot-machine-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
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



# ec2 instance resource
resource "aws_instance" "ecs_instance" {
  ami                    = "ami-0c55b159cbfafe1f0"  # Replace with the latest ECS-optimized AMI for your region
  instance_type          = "t2.micro"               # You can choose the instance type based on your needs
  key_name               = "your-key-pair"          # Replace with your SSH key name
  subnet_id              = "subnet-xxxxxxxx"         # Replace with your subnet ID
  security_groups        = ["ecs-sg"]                # Ensure security group allows inbound traffic on the required ports (e.g., 80)

  # IAM role allowing EC2 to run ECS tasks
  iam_instance_profile   = "ecsInstanceRole"

  tags = {
    Name = "ECS-Instance"
  }
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

