FROM adoptopenjdk/openjdk11

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","hello.Application"]
MAINTAINER tycorp

COPY target/cup-todo-0.0.1-SNAPSHOT.jar cup-todo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/simple-kanban-0.0.1-SNAPSHOT.jar"]