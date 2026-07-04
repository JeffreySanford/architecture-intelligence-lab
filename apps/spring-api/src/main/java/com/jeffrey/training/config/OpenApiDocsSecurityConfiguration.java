package com.jeffrey.training.config;

import com.jeffrey.training.api.entity.Permission;
import com.jeffrey.training.api.entity.Persona;
import com.jeffrey.training.api.repository.PersonaRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class OpenApiDocsSecurityConfiguration {

  private static final Set<String> SECURED_PATH_PREFIXES = Set.of("/v3/api-docs", "/swagger-ui");
  private static final Set<String> ALLOWED_PERMISSIONS = Set.of("contracts:view", "admin:view");

  @Bean
  public FilterRegistrationBean<OncePerRequestFilter> openApiDocsSecurityFilter(
      PersonaRepository personaRepository) {
    FilterRegistrationBean<OncePerRequestFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new OncePerRequestFilter() {
      private final Logger logger = LoggerFactory.getLogger(getClass());

      @Override
      protected void doFilterInternal(
          HttpServletRequest request,
          HttpServletResponse response,
          jakarta.servlet.FilterChain filterChain)
          throws IOException, jakarta.servlet.ServletException {
        String path = request.getServletPath();
        if (!isSecuredOpenApiPath(path)) {
          filterChain.doFilter(request, response);
          return;
        }

        logger.info("OpenAPI doc request headers: Cookie={} Cookies={}", request.getHeader("Cookie"), request.getCookies());
        Optional<Persona> persona = resolvePersona(request, personaRepository);
        if (persona.isEmpty() || !hasAllowedPermission(persona.get())) {
          logger.info("Denying OpenAPI docs access for path {} and persona cookie {}", path,
              extractToken(request));
          response.setStatus(HttpServletResponse.SC_FORBIDDEN);
          response.setContentType(MediaType.APPLICATION_JSON_VALUE);
          response.getWriter().write("{\"error\":\"forbidden\"}");
          return;
        }

        filterChain.doFilter(request, response);
      }
    });
    registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    registrationBean.addUrlPatterns("/v3/api-docs", "/v3/api-docs/*", "/swagger-ui", "/swagger-ui/*");
    return registrationBean;
  }

  private String extractToken(HttpServletRequest request) {
    if (request.getCookies() == null) {
      return "<none>";
    }
    for (Cookie cookie : request.getCookies()) {
      if ("access_token".equals(cookie.getName())) {
        return cookie.getValue();
      }
    }
    return "<none>";
  }

  private boolean isSecuredOpenApiPath(String path) {
    return SECURED_PATH_PREFIXES.stream().anyMatch(path::startsWith);
  }

  private Optional<Persona> resolvePersona(
      HttpServletRequest request,
      PersonaRepository personaRepository) {
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("access_token".equals(cookie.getName())) {
          return Optional.ofNullable(personaRepository.findByIdWithRoleAndPermissions(cookie.getValue()));
        }
      }
    }

    String cookieHeader = request.getHeader("Cookie");
    if (cookieHeader != null) {
      for (String cookieValue : cookieHeader.split(";")) {
        String[] parts = cookieValue.trim().split("=", 2);
        if (parts.length == 2 && "access_token".equals(parts[0].trim())) {
          return Optional.ofNullable(personaRepository.findByIdWithRoleAndPermissions(parts[1].trim()));
        }
      }
    }

    return Optional.empty();
  }

  private boolean hasAllowedPermission(Persona persona) {
    return persona.getRole().getPermissions().stream()
        .map(Permission::getId)
        .anyMatch(ALLOWED_PERMISSIONS::contains);
  }
}
