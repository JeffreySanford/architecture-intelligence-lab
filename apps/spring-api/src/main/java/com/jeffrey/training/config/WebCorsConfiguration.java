package com.jeffrey.training.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfiguration implements WebMvcConfigurer {

  private static final List<String> DEFAULT_ALLOWED_ORIGINS = List.of(
      "http://localhost:4200",
      "http://127.0.0.1:4200",
      "http://localhost:4201",
      "http://127.0.0.1:4201",
      "http://localhost:18080",
      "http://127.0.0.1:18080"
  );

  private final List<String> allowedOrigins;

  public WebCorsConfiguration(@Value("${spring.api.origins:}") String allowedOriginsProperty) {
    if (allowedOriginsProperty == null || allowedOriginsProperty.isBlank()) {
      this.allowedOrigins = DEFAULT_ALLOWED_ORIGINS;
    } else {
      List<String> origins = Arrays.stream(allowedOriginsProperty.split(","))
          .map(String::trim)
          .filter(origin -> !origin.isBlank() && !origin.contains("*") && !origin.equals("*"))
          .collect(Collectors.toList());
      this.allowedOrigins = origins.isEmpty() ? DEFAULT_ALLOWED_ORIGINS : origins;
    }
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(allowedOrigins.toArray(String[]::new))
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
  }
}
