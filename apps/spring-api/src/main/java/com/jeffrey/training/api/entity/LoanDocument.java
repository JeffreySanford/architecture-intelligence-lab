package com.jeffrey.training.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "loan_documents")
public class LoanDocument {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "status", nullable = false)
    private String status;

    public LoanDocument() {
    }

    public LoanDocument(String id, Loan loan, String documentType, String status) {
        this.id = id;
        this.loan = loan;
        this.documentType = documentType;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public Loan getLoan() {
        return loan;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getStatus() {
        return status;
    }
}
