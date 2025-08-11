#!/bin/bash

mvn clean package -DskipTests
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t hoangson93/lms-service:0.0.1-amd64 \
  -t hoangson93/lms-service:0.0.1-arm64 \
  --push .

#mvn clean package -DskipTests
#docker build --platform linux/amd64 -t hoangson93/lms-service:1.0.0-amd64 .
#docker push hoangson93/lms-service:1.0.0-amd-64