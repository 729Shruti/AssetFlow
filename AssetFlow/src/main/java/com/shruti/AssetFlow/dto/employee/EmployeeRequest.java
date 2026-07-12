package com.shruti.AssetFlow.dto.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequest {

    @NotBlank
    private String firstName;

    private String lastName;

    @Email
    private String email;

    private String phone;

    private String designation;

    @NotBlank
    private String password;

    private Long departmentId;
}