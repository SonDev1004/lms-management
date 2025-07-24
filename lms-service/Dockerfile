FROM openjdk:21

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} lms-service.jar

ENTRYPOINT ["java", "-jar", "/lms-service.jar"]

EXPOSE 8081