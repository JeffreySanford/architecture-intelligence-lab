package com.jeffrey.training.api;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class DevAuthTokenService {
  private static final String TOKEN_VERSION = "v1";
  private static final String HMAC_ALGORITHM = "HmacSHA256";
  private static final long DEFAULT_TTL_SECONDS = 60L * 60L * 8L;
  private static final String DEFAULT_SECRET = "local-training-lab-dev-secret";

  private final Clock clock;
  private final String secret;

  public DevAuthTokenService() {
    this(Clock.systemUTC(), System.getenv().getOrDefault("DEV_AUTH_SECRET", DEFAULT_SECRET));
  }

  DevAuthTokenService(Clock clock, String secret) {
    this.clock = clock;
    this.secret = secret == null || secret.isBlank() ? DEFAULT_SECRET : secret;
  }

  public String createToken(String personaId) {
    long expiresAt = Instant.now(clock).getEpochSecond() + DEFAULT_TTL_SECONDS;
    String encodedPersona = base64Url(personaId.getBytes(StandardCharsets.UTF_8));
    String unsignedToken = TOKEN_VERSION + "." + encodedPersona + "." + expiresAt;
    return unsignedToken + "." + signature(unsignedToken);
  }

  public String resolvePersonaId(String token) {
    if (token == null || token.isBlank()) {
      return null;
    }

    String[] parts = token.split("\\.", -1);
    if (parts.length != 4 || !TOKEN_VERSION.equals(parts[0])) {
      return null;
    }

    String unsignedToken = parts[0] + "." + parts[1] + "." + parts[2];
    if (!constantTimeEquals(signature(unsignedToken), parts[3])) {
      return null;
    }

    long expiresAt;
    try {
      expiresAt = Long.parseLong(parts[2]);
    } catch (NumberFormatException error) {
      return null;
    }

    if (expiresAt < Instant.now(clock).getEpochSecond()) {
      return null;
    }

    try {
      byte[] decodedPersona = Base64.getUrlDecoder().decode(parts[1]);
      return new String(decodedPersona, StandardCharsets.UTF_8);
    } catch (IllegalArgumentException error) {
      return null;
    }
  }

  private String signature(String unsignedToken) {
    try {
      Mac mac = Mac.getInstance(HMAC_ALGORITHM);
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
      return base64Url(mac.doFinal(unsignedToken.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception error) {
      throw new IllegalStateException("Unable to sign dev auth token", error);
    }
  }

  private String base64Url(byte[] value) {
    return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
  }

  private boolean constantTimeEquals(String left, String right) {
    if (left == null || right == null || left.length() != right.length()) {
      return false;
    }

    int result = 0;
    for (int index = 0; index < left.length(); index++) {
      result |= left.charAt(index) ^ right.charAt(index);
    }
    return result == 0;
  }
}
