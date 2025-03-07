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
