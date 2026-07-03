package com.jeffrey.training;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.jpa.open-in-view=false")
@ActiveProfiles("test")
class TrainingJavaApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
