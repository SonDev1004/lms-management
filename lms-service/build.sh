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

#docker run -d -p 8081:8081 -e OPENAPI_SERVER_URL="14.225.198.117" -e SPRING_PROFILES_ACTIVE=dev -e DBMS_PASSWORD=123456Aa@ -e DBMS_URL="jdbc:sqlserver://14.225.198.117:1433;databaseName=dev_lms_management;encrypt=true;trustServerCertificate=true" -e DBMS_USERNAME=son -e MINIO_ACCESS_KEY=admin -e MINIO_ENDPOINT="http://14.225.198.117:9000" -e MINIO_SECRET_KEY=minio123456 -e MINIO_BUCKET_NAME=test-upload -e EXPIRY_MINUTES=20 -e EXPIRY_DAY=14 hoangson93/lms-service:0.0.1-amd64