FROM adoptopenjdk/openjdk11 as builder

COPY ./target/*.jar ./simple-kanban-apiserver.jar

RUN java -Djarmode=layertools -jar ./simple-kanban-apiserver.jar extract

FROM adoptopenjdk/openjdk11

COPY --from=builder ./dependencies/ ./
COPY --from=builder ./spring-boot-loader/ ./
COPY --from=builder ./snapshot-dependencies/ ./
COPY --from=builder ./application/ ./

ENV SPRING_ENV=v1 \

    DB_USERNAME=v2 \
    DB_PWD=v3 \
    DB_URL=v4 \

    CORS_ORIGIN=v5 \

    CORRELATION_ALIAS=v6

ENTRYPOINT [ "java", "org.springframework.boot.loader.JarLauncher" ]