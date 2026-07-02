package com.jeffrey.training.api;

import jakarta.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
class LabController {
  private static final String DEFAULT_PERSONA_ID = "alice-viewer";

  private final JdbcTemplate jdbcTemplate;

  LabController(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @GetMapping("/health")
  Map<String, String> health() {
    return Map.of("status", "ok", "service", "spring-api");
  }

  @GetMapping("/personas")
  List<PersonaDto> personas() {
    return queryPersonas();
  }

  @PostMapping("/dev-auth/personas/{personaId}/select")
  CurrentUserDto selectPersona(
      @PathVariable String personaId,
      HttpServletResponse response
  ) {
    CurrentUserDto currentUser = currentUserFor(personaId);
    ResponseCookie cookie = ResponseCookie.from("access_token", currentUser.persona().id())
        .httpOnly(true)
        .sameSite("Lax")
        .path("/")
        .maxAge(60 * 60 * 8)
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    return currentUser;
  }

  @GetMapping("/me")
  CurrentUserDto me(
      @CookieValue(name = "access_token", required = false) String personaId
  ) {
    return currentUserFor(personaId == null || personaId.isBlank() ? DEFAULT_PERSONA_ID : personaId);
  }

  @GetMapping("/dashboard/snapshot")
  DashboardSnapshotDto dashboardSnapshot(
      @RequestParam(defaultValue = "small") String dataset
  ) {
    List<BorrowerDto> borrowers = jdbcTemplate.query(
        "select id, display_name, credit_score, risk_band from borrowers order by id",
        (rs, rowNum) -> new BorrowerDto(
            rs.getString("id"),
            rs.getString("display_name"),
            rs.getInt("credit_score"),
            rs.getString("risk_band")
        )
    );

    List<LoanStatusCodeDto> statusCodes = jdbcTemplate.query(
        "select code, label, sort_order from loan_status_codes order by sort_order",
        (rs, rowNum) -> new LoanStatusCodeDto(
            rs.getString("code"),
            rs.getString("label"),
            rs.getInt("sort_order")
        )
    );

    List<LoanDto> loans = jdbcTemplate.query(
        """
        select id, borrower_id, loan_number, amount, status_code, updated_at
        from loans
        order by loan_number
        """,
        (rs, rowNum) -> new LoanDto(
            rs.getString("id"),
            rs.getString("borrower_id"),
            rs.getString("loan_number"),
            rs.getBigDecimal("amount"),
            rs.getString("status_code"),
            rs.getTimestamp("updated_at").toInstant()
        )
    );

    List<LoanDocumentDto> documents = jdbcTemplate.query(
        "select id, loan_id, document_type, status from loan_documents order by id",
        (rs, rowNum) -> new LoanDocumentDto(
            rs.getString("id"),
            rs.getString("loan_id"),
            rs.getString("document_type"),
            rs.getString("status")
        )
    );

    return new DashboardSnapshotDto(dataset, loans, borrowers, documents, statusCodes);
  }

  private CurrentUserDto currentUserFor(String personaId) {
    return queryPersonas().stream()
        .filter(persona -> persona.id().equals(personaId))
        .findFirst()
        .map(persona -> new CurrentUserDto(persona, List.of(persona.role()), persona.permissions()))
        .orElseGet(() -> currentUserFor(DEFAULT_PERSONA_ID));
  }

  private List<PersonaDto> queryPersonas() {
    return jdbcTemplate.query(
        """
        select
          p.id,
          p.display_name,
          r.label as role_label,
          p.description,
          coalesce(array_agg(rp.permission_id order by rp.permission_id)
            filter (where rp.permission_id is not null), '{}') as permissions
        from personas p
        join roles r on r.id = p.role_id
        left join role_permissions rp on rp.role_id = r.id
        group by p.id, p.display_name, r.label, p.description
        order by p.display_name
        """,
        (rs, rowNum) -> new PersonaDto(
            rs.getString("id"),
            rs.getString("display_name"),
            rs.getString("role_label"),
            rs.getString("description"),
            List.of((String[]) rs.getArray("permissions").getArray())
        )
    );
  }

  record PersonaDto(
      String id,
      String name,
      String role,
      String description,
      List<String> permissions
  ) {}

  record CurrentUserDto(
      PersonaDto persona,
      List<String> roles,
      List<String> permissions
  ) {}

  record DashboardSnapshotDto(
      String dataset,
      List<LoanDto> loans,
      List<BorrowerDto> borrowers,
      List<LoanDocumentDto> documents,
      List<LoanStatusCodeDto> statusCodes
  ) {}

  record LoanDto(
      String id,
      String borrowerId,
      String loanNumber,
      BigDecimal amount,
      String statusCode,
      Instant updatedAt
  ) {}

  record BorrowerDto(
      String id,
      String name,
      int creditScore,
      String riskBand
  ) {}

  record LoanDocumentDto(
      String id,
      String loanId,
      String documentType,
      String status
  ) {}

  record LoanStatusCodeDto(
      String code,
      String label,
      int sortOrder
  ) {}
}
