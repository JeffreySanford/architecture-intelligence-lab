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
class OpenApiContractAvailabilityTests {

    @LocalServerPort
    private int port;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void shouldExposeOpenApiJsonForContractAdminPersonaCookie() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:" + port + "/v3/api-docs"))
            .header("Cookie", "access_token=fiona-contract-admin")
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type").orElse(""))
            .contains("application/json");
        assertThat(response.body()).contains("\"openapi\"");
    }
}
