package com.jeffrey.training;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
    webEnvironment = WebEnvironment.RANDOM_PORT,
    properties = "spring.jpa.open-in-view=false"
)
@ActiveProfiles("test")
class OpenApiDocsSecurityTests {

    @LocalServerPort
    private int port;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void shouldRejectSwaggerUiWhenNoPersonaCookieIsPresent() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:" + port + "/swagger-ui/index.html"))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(403);
        assertThat(response.body()).contains("forbidden");
    }

    @Test
    void shouldAllowSwaggerUiForContractAdminPersonaCookie() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:" + port + "/swagger-ui/index.html"))
            .header("Cookie", selectPersonaCookie("fiona-contract-admin"))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("Swagger UI");
    }

  @Test
  void shouldRejectApiDocsWhenNoPersonaCookieIsPresent() throws Exception {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(new URI("http://localhost:" + port + "/v3/api-docs"))
          .GET()
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

      assertThat(response.statusCode()).isEqualTo(403);
      assertThat(response.body()).contains("forbidden");
  }

  @Test
  void shouldAllowApiDocsForContractAdminPersonaCookie() throws Exception {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(new URI("http://localhost:" + port + "/v3/api-docs"))
          .header("Cookie", selectPersonaCookie("fiona-contract-admin"))
          .GET()
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

      assertThat(response.statusCode()).isEqualTo(200);
      assertThat(response.body()).contains("openapi");
  }

  @Test
  void shouldRejectApiDocsForUnsignedPersonaCookie() throws Exception {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(new URI("http://localhost:" + port + "/v3/api-docs"))
          .header("Cookie", "access_token=fiona-contract-admin")
          .GET()
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

      assertThat(response.statusCode()).isEqualTo(403);
      assertThat(response.body()).contains("forbidden");
  }

  private String selectPersonaCookie(String personaId) throws Exception {
      HttpRequest request = HttpRequest.newBuilder()
          .uri(new URI("http://localhost:" + port + "/api/dev-auth/personas/" + personaId + "/select"))
          .POST(HttpRequest.BodyPublishers.noBody())
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

      assertThat(response.statusCode()).isEqualTo(200);
      String setCookie = response.headers().firstValue("set-cookie").orElseThrow();
      assertThat(setCookie).contains("access_token=v1.");
      return setCookie.split(";", 2)[0];
  }
}
