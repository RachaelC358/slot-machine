provider "aws" {
  region  = "us-east-1"
  profile = "default"
}

resource "aws_ecr_repository" "slot-machine-repo" {
  name = "slot-machine-repo"
}

resource "aws_ecs_cluster" "slot-machine-cluster" {
  name = "slot-machine-cluster"
}

resource "aws_ecs_task_definition" "slot-machine-cluster" {
  family                   = "slot-machine-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "slot-machine"
      image     = "${aws_ecr_repository.slot-machine-repo.repository_url}:latest"
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

resource "aws_ecs_service" "slot-machine" {
  name            = "slot-machine-service"
  cluster         = aws_ecs_cluster.slot-machine-cluster.id
  task_definition = aws_ecs_task_definition.slot-machine-cluster.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["subnet-0be1cf88c7ab6cc5e"]
    assign_public_ip = true
  }
}
