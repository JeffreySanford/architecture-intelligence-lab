package com.jeffrey.training.api.repository;

import com.jeffrey.training.api.entity.LoanDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDocumentRepository extends JpaRepository<LoanDocument, String> {
}
