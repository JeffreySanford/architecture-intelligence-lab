# Postgres Init Scripts

Docker Compose mounts this folder at `/docker-entrypoint-initdb.d` for fresh local
Postgres volumes.

The Spring API remains the runtime migration owner through Flyway files in
`apps/spring-api/src/main/resources/db/migration`. Keep these init scripts aligned
with those Flyway migrations so a clean Postgres container and Spring startup
produce the same lab schema and seed data.
