## Description

init template for project (NestJS + MariaDB + Docker + Docker Compose)

DDD, MicroServices, gRPC, oAuth 2.0

## Project setup

1. You should have a .env file in your root directory
2. execute below command if you have a .env file in root directory

```bash
$ docker compose build
```

## Run the project

```bash
$ docker compose up -d
```

## Shut down the project

```bash
$ docker compose down -v
```

## Connect App

```bash
$ docker compose exec app sh 
```

## Connect DB

```bash
# you should enter the password in .env file
$ docker compose exec db mariadb -u [user_name] -p 
```

## [proto-gen]
```bash
# you should move to generate file in types directory
$ protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/[proto_file_name]
```