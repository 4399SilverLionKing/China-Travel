FROM openjdk:17
LABEL maintainer="asta"
COPY target/travel-0.0.1-SNAPSHOT.jar app.jar
ENV JAVA_OPTS="-Xms256m -Xmx256m"
ENV SPRING_ARGS=""
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--logging.file.path=/tmp/logs/spring-boot"]
