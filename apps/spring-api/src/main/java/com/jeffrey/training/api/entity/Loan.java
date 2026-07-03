package com.jeffrey.training.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower;

    @Column(name = "loan_number", nullable = false)
    private String loanNumber;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "status_code", nullable = false)
    private LoanStatusCode statusCode;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Loan() {
    }

    public Loan(String id, Borrower borrower, String loanNumber, BigDecimal amount, LoanStatusCode statusCode, Instant updatedAt) {
        this.id = id;
        this.borrower = borrower;
        this.loanNumber = loanNumber;
        this.amount = amount;
        this.statusCode = statusCode;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public Borrower getBorrower() {
        return borrower;
    }

    public String getLoanNumber() {
        return loanNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LoanStatusCode getStatusCode() {
        return statusCode;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
