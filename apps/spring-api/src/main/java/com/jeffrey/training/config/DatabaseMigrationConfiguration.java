package com.jeffrey.training.config;

import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!test")
class DatabaseMigrationConfiguration {
  @Bean
  InitializingBean migrateDatabase(DataSource dataSource) {
    return () -> {
      Flyway flyway = Flyway.configure()
          .dataSource(dataSource)
          .locations("classpath:db/migration")
          .load();
      flyway.repair();
      flyway.migrate();
    };
  }
}
