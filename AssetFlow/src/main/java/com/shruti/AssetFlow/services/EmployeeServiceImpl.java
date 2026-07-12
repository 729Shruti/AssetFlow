package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.employee.EmployeeRequest;
import com.shruti.AssetFlow.dto.employee.EmployeeResponse;
import com.shruti.AssetFlow.entities.Department;
import com.shruti.AssetFlow.entities.Employee;
import com.shruti.AssetFlow.entities.enums.EmployeeStatus;
import com.shruti.AssetFlow.entities.enums.Role;
import com.shruti.AssetFlow.exception.DuplicateResourceException;
import com.shruti.AssetFlow.exception.ResourceNotFoundException;
import com.shruti.AssetFlow.repositories.DepartmentRepository;
import com.shruti.AssetFlow.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id : "
                                + request.getDepartmentId()));

        String employeeCode = generateEmployeeCode();

        Employee employee = Employee.builder()
                .employeeId(employeeCode)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .designation(request.getDesignation())
                .password(request.getPassword())
                .role(Role.EMPLOYEE)
                .status(EmployeeStatus.ACTIVE)
                .department(department)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);

        return mapToResponse(savedEmployee);
    }

    @Override
    public EmployeeResponse getEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id : " + id));

        return mapToResponse(employee);
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id : " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id : "
                                + request.getDepartmentId()));

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setPassword(request.getPassword());
        employee.setDepartment(department);

        Employee updatedEmployee = employeeRepository.save(employee);

        return mapToResponse(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id : " + id));

        employee.setStatus(EmployeeStatus.INACTIVE);

        employeeRepository.save(employee);
    }

    private String generateEmployeeCode() {

        long count = employeeRepository.count() + 1;

        return String.format("EMP%03d", count);
    }

    private EmployeeResponse mapToResponse(Employee employee) {

        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .designation(employee.getDesignation())
                .departmentName(employee.getDepartment().getName())
                .role(employee.getRole())
                .status(employee.getStatus())
                .build();
    }
}