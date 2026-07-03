package com.jeffrey.training.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    private String id;

    @Column(name = "label", nullable = false)
    private String label;

    @ManyToMany
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;

    public Role() {
    }

    public Role(String id, String label, Set<Permission> permissions) {
        this.id = id;
        this.label = label;
        this.permissions = permissions;
    }

    public String getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }
}
