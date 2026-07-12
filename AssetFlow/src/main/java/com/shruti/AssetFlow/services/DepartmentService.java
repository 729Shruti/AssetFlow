package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.department.DepartmentRequest;
import com.shruti.AssetFlow.dto.department.DepartmentResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DepartmentService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    DepartmentResponse getDepartmentById(Long id);

    List<DepartmentResponse> getAllDepartments();

    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);

    void deleteDepartment(Long id);

}