package com.jeffrey.training.api.repository;

import com.jeffrey.training.api.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, String> {
}
