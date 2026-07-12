package com.shruti.AssetFlow.repositories;

import com.shruti.AssetFlow.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByName(String name);

    boolean existsByCode(String code);

    Optional<Department> findByName(String name);

    Optional<Department> findByCode(String code);

}