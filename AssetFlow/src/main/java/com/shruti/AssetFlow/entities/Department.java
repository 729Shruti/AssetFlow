package com.shruti.AssetFlow.entities;

import com.shruti.AssetFlow.entities.enums.DepartmentStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private DepartmentStatus status = DepartmentStatus.ACTIVE;
}