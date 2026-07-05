package com.jeffrey.training.api;

import jakarta.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jeffrey.training.api.entity.Persona;
import com.jeffrey.training.api.repository.BorrowerRepository;
import com.jeffrey.training.api.repository.LoanDocumentRepository;
import com.jeffrey.training.api.repository.LoanRepository;
import com.jeffrey.training.api.repository.LoanStatusCodeRepository;
import com.jeffrey.training.api.repository.PersonaRepository;

@RestController
@RequestMapping("/api")
class LabController {
  private static final String DEFAULT_PERSONA_ID = "alice-viewer";

  private final PersonaRepository personaRepository;
  private final BorrowerRepository borrowerRepository;
  private final LoanRepository loanRepository;
  private final LoanDocumentRepository loanDocumentRepository;
  private final LoanStatusCodeRepository loanStatusCodeRepository;

  LabController(
      PersonaRepository personaRepository,
      BorrowerRepository borrowerRepository,
      LoanRepository loanRepository,
      LoanDocumentRepository loanDocumentRepository,
      LoanStatusCodeRepository loanStatusCodeRepository) {
    this.personaRepository = personaRepository;
    this.borrowerRepository = borrowerRepository;
    this.loanRepository = loanRepository;
    this.loanDocumentRepository = loanDocumentRepository;
    this.loanStatusCodeRepository = loanStatusCodeRepository;
  }

  @GetMapping("/health")
  Map<String, String> health() {
    return Map.of("status", "ok", "service", "spring-api");
  }

  @GetMapping("/personas")
  List<PersonaDto> personas() {
    return personaRepository.findAllWithRoleAndPermissions().stream()
        .map(this::toPersonaDto)
        .collect(Collectors.toList());
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
    List<BorrowerDto> borrowers = borrowerRepository.findAll(Sort.by("id")).stream()
        .map(b -> new BorrowerDto(b.getId(), b.getDisplayName(), b.getCreditScore(), b.getRiskBand()))
        .collect(Collectors.toList());

    List<LoanStatusCodeDto> statusCodes = loanStatusCodeRepository.findAll(Sort.by("sortOrder")).stream()
        .map(code -> new LoanStatusCodeDto(code.getCode(), code.getLabel(), code.getSortOrder()))
        .collect(Collectors.toList());

    List<LoanDto> loans = loanRepository.findAll(Sort.by("loanNumber")).stream()
        .map(loan -> new LoanDto(
            loan.getId(),
            loan.getBorrower().getId(),
            loan.getLoanNumber(),
            loan.getAmount(),
            loan.getStatusCode().getCode(),
            loan.getUpdatedAt()
        ))
        .collect(Collectors.toList());

    loans = filterLoansByDataset(loans, dataset);

    Set<String> loanBorrowerIds = loans.stream().map(LoanDto::borrowerId).collect(Collectors.toSet());
    List<BorrowerDto> filteredBorrowers = borrowers.stream()
        .filter(borrower -> loanBorrowerIds.contains(borrower.id()))
        .collect(Collectors.toList());

    List<LoanDocumentDto> documents = loanDocumentRepository.findAll(Sort.by("id")).stream()
        .map(document -> new LoanDocumentDto(
            document.getId(),
            document.getLoan().getId(),
            document.getDocumentType(),
            document.getStatus()
        ))
        .collect(Collectors.toList());

    Set<String> loanIds = loans.stream().map(LoanDto::id).collect(Collectors.toSet());
    List<LoanDocumentDto> filteredDocuments = documents.stream()
        .filter(document -> loanIds.contains(document.loanId()))
        .collect(Collectors.toList());

    return new DashboardSnapshotDto(dataset, loans, filteredBorrowers, filteredDocuments, statusCodes);
  }

  private CurrentUserDto currentUserFor(String personaId) {
    Persona persona = personaRepository.findByIdWithRoleAndPermissions(personaId);
    if (persona == null) {
      return currentUserFor(DEFAULT_PERSONA_ID);
    }
    PersonaDto personaDto = toPersonaDto(persona);
    return new CurrentUserDto(personaDto, List.of(personaDto.role()), personaDto.permissions());
  }

  private PersonaDto toPersonaDto(Persona persona) {
    return new PersonaDto(
        persona.getId(),
        persona.getDisplayName(),
        persona.getRole().getLabel(),
        persona.getDescription(),
        persona.getRole().getPermissions().stream()
            .map(permission -> permission.getId())
            .sorted()
            .collect(Collectors.toList())
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

  private List<LoanDto> filterLoansByDataset(List<LoanDto> loans, String dataset) {
    int limit;
    switch (dataset.toLowerCase()) {
      case "small" -> limit = 5;
      case "medium" -> limit = 10;
      case "large" -> limit = 20;
      case "stress" -> limit = 30;
      default -> limit = loans.size();
    }
    return loans.stream().limit(Math.min(limit, loans.size())).collect(Collectors.toList());
  }

  record BorrowerDto(
      String id,
      String name,
      int creditScore,
      String riskBand
  ) {}

  record LoanDto(
      String id,
      String borrowerId,
      String loanNumber,
      BigDecimal amount,
      String statusCode,
      Instant updatedAt
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
