package com.shruti.AssetFlow.entities;

import com.shruti.AssetFlow.entities.enums.AssetCondition;
import com.shruti.AssetFlow.entities.enums.AssetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String assetTag;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String serialNumber;

    private String brand;

    private String model;

    private LocalDate purchaseDate;

    private Double purchaseCost;

    private String location;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;

    @Enumerated(EnumType.STRING)
    private AssetCondition condition;

    private Boolean bookable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private AssetCategory category;
}