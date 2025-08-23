#!/bin/bash

DOCKER_USERNAME="hoangson93"
IMAGE_NAME="lms-frontend"
TAG="latest"

docker buildx create --use

docker buildx build --platform linux/amd64 -t $DOCKER_USERNAME/$IMAGE_NAME:$TAG --push .

echo "Đã build và push image $DOCKER_USERNAME/$IMAGE_NAME:$TAG (amd64) lên Docker Hub thành công!"