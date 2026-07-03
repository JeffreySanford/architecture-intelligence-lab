package com.jeffrey.training.api.repository;

import com.jeffrey.training.api.entity.LoanStatusCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanStatusCodeRepository extends JpaRepository<LoanStatusCode, String> {
}
