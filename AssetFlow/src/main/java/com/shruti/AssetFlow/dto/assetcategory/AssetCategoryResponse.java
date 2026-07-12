package com.shruti.AssetFlow.dto.assetcategory;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AssetCategoryResponse {

    private Long id;

    private String name;

    private String description;

}