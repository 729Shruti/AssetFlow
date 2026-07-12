package com.shruti.AssetFlow.dto.employee;

import com.shruti.AssetFlow.entities.enums.EmployeeStatus;
import com.shruti.AssetFlow.entities.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EmployeeResponse {

    private Long id;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String designation;

    private String departmentName;

    private Role role;

    private EmployeeStatus status;
}