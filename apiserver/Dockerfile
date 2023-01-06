FROM adoptopenjdk/openjdk11 as builder

WORKDIR ./apiserver

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} ./simple-kanban-apiserver.jar

RUN java -Djarmode=layertools -jar ./simple-kanban-apiserver.jar extract

FROM adoptopenjdk/openjdk11

MAINTAINER tycorp

WORKDIR ./apiserver

ARG LAYERED_JAR_DIR=./apiserver

COPY --from=builder ${LAYERED_JAR_DIR}/dependencies/ ./
COPY --from=builder ${LAYERED_JAR_DIR}/spring-boot-loader/ ./
COPY --from=builder ${LAYERED_JAR_DIR}/snapshot-dependencies/ ./
COPY --from=builder ${LAYERED_JAR_DIR}/application/ ./

ENTRYPOINT ["java", "-Djasypt.encryptor.password=simplekanban"  ,"org.springframework.boot.loader.JarLauncher"]