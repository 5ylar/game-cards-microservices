# Matching Cards
This is a kind of game card microservices. Designed for scale up and implement more features.

## Overview Architecture

![Alt text](images/arch.png?raw=true "Title")


## Features

+ Card matching puzzle
+ Match's session remember
+ Ranking

## Prerequisite

+ Docker
+ Docker Compose

## Deployment Steps (with local docker)

+ Go to root project directory
+ Run following command

```sh
docker-compose up -d --build
```

+ Run the command below to watch the containers status, then wait util all services started successfully (Except ***"db_migrations"*** service)

```sh
docker-compose ps -a
```

+ After things are good, go to http://localhost:3001. Enjoy.

## API Documentation

http://localhost:9000/docs

## Example UI
![Alt text](images/ui_1.png?raw=true "Title")

![Alt text](images/ui_2.png?raw=true "Title")

![Alt text](images/ui_3.png?raw=true "Title")

![Alt text](images/ui_4.png?raw=true "Title")