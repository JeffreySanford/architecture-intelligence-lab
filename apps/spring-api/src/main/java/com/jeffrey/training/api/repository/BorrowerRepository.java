package com.jeffrey.training.api.repository;

import com.jeffrey.training.api.entity.Borrower;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowerRepository extends JpaRepository<Borrower, String> {
}
