package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.department.DepartmentRequest;
import com.shruti.AssetFlow.dto.department.DepartmentResponse;
import com.shruti.AssetFlow.entities.Department;
import com.shruti.AssetFlow.repositories.DepartmentRepository;
import com.shruti.AssetFlow.services.DepartmentService;
import com.shruti.AssetFlow.exception.DuplicateResourceException;
import com.shruti.AssetFlow.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {

        if (departmentRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Department name already exists");
        }

        if (departmentRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Department code already exists");
        }

        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode())
                .build();

        Department savedDepartment = departmentRepository.save(department);

        return mapToResponse(savedDepartment);
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id : " + id));

        return mapToResponse(department);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id : " + id));

        department.setName(request.getName());
        department.setCode(request.getCode());

        Department updatedDepartment = departmentRepository.save(department);

        return mapToResponse(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id : " + id));

        departmentRepository.delete(department);
    }

    private DepartmentResponse mapToResponse(Department department) {

        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .status(department.getStatus())
                .build();
    }
}