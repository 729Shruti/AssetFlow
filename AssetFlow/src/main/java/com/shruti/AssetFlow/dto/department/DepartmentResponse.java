package com.shruti.AssetFlow.dto.department;

import com.shruti.AssetFlow.entities.enums.DepartmentStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {

    private Long id;

    private String name;

    private String code;

    private DepartmentStatus status;

}