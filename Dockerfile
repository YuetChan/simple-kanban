FROM adoptopenjdk/openjdk11
MAINTAINER tycorp
COPY target/cup-todo-0.0.1-SNAPSHOT.jar cup-todo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/cup-todo-0.0.1-SNAPSHOT.jar"]