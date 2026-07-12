package com.shruti.AssetFlow.dto.asset;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AssetRequest {

    private String name;

    private String serialNumber;

    private String brand;

    private String model;

    private LocalDate purchaseDate;

    private Double purchaseCost;

    private String location;

    private Boolean bookable;

    private Long departmentId;

    private Long categoryId;
}