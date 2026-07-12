package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.employee.EmployeeRequest;
import com.shruti.AssetFlow.dto.employee.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(EmployeeRequest request);

    EmployeeResponse getEmployee(Long id);

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);

    void deleteEmployee(Long id);

}