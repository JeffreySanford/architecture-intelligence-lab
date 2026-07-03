package com.jeffrey.training.api.repository;

import com.jeffrey.training.api.entity.Persona;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PersonaRepository extends JpaRepository<Persona, String> {

    @Query("select distinct p from Persona p join fetch p.role r left join fetch r.permissions order by p.displayName")
    List<Persona> findAllWithRoleAndPermissions();

    @Query("select p from Persona p join fetch p.role r left join fetch r.permissions where p.id = :id")
    Persona findByIdWithRoleAndPermissions(String id);
}
