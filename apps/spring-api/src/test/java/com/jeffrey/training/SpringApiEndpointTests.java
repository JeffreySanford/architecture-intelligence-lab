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
class SpringApiEndpointTests {

    @LocalServerPort
    private int port;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void shouldReturnCurrentUserAsDefaultPersonaWhenNoCookieIsPresent() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:" + port + "/api/me"))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type").orElse(""))
            .contains("application/json");
        assertThat(response.body()).contains("\"id\":\"alice-viewer\"");
    }

    @Test
    void shouldSetSignedDevAuthCookieWhenPersonaIsSelected() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:" + port + "/api/dev-auth/personas/fiona-contract-admin/select"))
            .POST(HttpRequest.BodyPublishers.noBody())
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        String setCookie = response.headers().firstValue("set-cookie").orElse("");
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(setCookie).contains("HttpOnly");
        assertThat(setCookie).contains("SameSite=Lax");
        assertThat(setCookie).contains("access_token=v1.");
        assertThat(setCookie).doesNotContain("access_token=fiona-contract-admin;");
    }

    @Test
    void shouldReturnDashboardSnapshot() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("http://localhost:" + port + "/api/dashboard/snapshot"))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type").orElse(""))
            .contains("application/json");
        assertThat(response.body()).contains("\"dataset\":\"small\"");
    }
}
