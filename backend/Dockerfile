FROM adoptopenjdk/openjdk11 as builder

COPY ./target/*.jar ./simple-kanban-backend.jar

RUN java -Djarmode=layertools -jar ./simple-kanban-backend.jar extract

FROM adoptopenjdk/openjdk11

COPY --from=builder ./dependencies/ ./
COPY --from=builder ./spring-boot-loader/ ./
COPY --from=builder ./snapshot-dependencies/ ./
COPY --from=builder ./application/ ./

ENTRYPOINT [ "java", "org.springframework.boot.loader.JarLauncher" ]