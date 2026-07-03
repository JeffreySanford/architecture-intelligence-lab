package com.jeffrey.training.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "borrowers")
public class Borrower {

    @Id
    private String id;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "credit_score", nullable = false)
    private int creditScore;

    @Column(name = "risk_band", nullable = false)
    private String riskBand;

    public Borrower() {
    }

    public Borrower(String id, String displayName, int creditScore, String riskBand) {
        this.id = id;
        this.displayName = displayName;
        this.creditScore = creditScore;
        this.riskBand = riskBand;
    }

    public String getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getCreditScore() {
        return creditScore;
    }

    public String getRiskBand() {
        return riskBand;
    }
}
