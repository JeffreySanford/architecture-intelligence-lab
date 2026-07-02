FROM eclipse-temurin:21-jdk

WORKDIR /workspace

COPY .mvn ./.mvn
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd
COPY pom.xml pom.xml
COPY apps/spring-api/pom.xml apps/spring-api/pom.xml

RUN chmod +x mvnw && ./mvnw -pl apps/spring-api -am dependency:go-offline -DskipTests

COPY apps/spring-api apps/spring-api

EXPOSE 8080

CMD ["./mvnw", "-pl", "apps/spring-api", "spring-boot:run", "-Dspring-boot.run.profiles=docker"]

