package com.shruti.AssetFlow.dto.asset;

import com.shruti.AssetFlow.entities.enums.AssetCondition;
import com.shruti.AssetFlow.entities.enums.AssetStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AssetResponse {

    private Long id;

    private String assetTag;

    private String name;

    private String serialNumber;

    private String brand;

    private String model;

    private String department;

    private String category;

    private String location;

    private AssetStatus status;

    private AssetCondition condition;

    private Boolean bookable;
}