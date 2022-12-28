FROM adoptopenjdk/openjdk11

MAINTAINER tycorp

ARG SPRING_PROFILES_ACTIVE=production
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE}

COPY target/cup-todo-0.0.1-SNAPSHOT.jar cup-todo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/cup-todo-0.0.1-SNAPSHOT.jar"]