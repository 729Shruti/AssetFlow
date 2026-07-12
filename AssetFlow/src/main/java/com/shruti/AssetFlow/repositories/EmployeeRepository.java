package com.shruti.AssetFlow.repositories;

import com.shruti.AssetFlow.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    Optional<Employee> findByEmail(String email);

}