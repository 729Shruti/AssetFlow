package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.assetcategory.AssetCategoryRequest;
import com.shruti.AssetFlow.dto.assetcategory.AssetCategoryResponse;

import java.util.List;

public interface AssetCategoryService {

    AssetCategoryResponse createCategory(AssetCategoryRequest request);

    List<AssetCategoryResponse> getAllCategories();

    AssetCategoryResponse getCategoryById(Long id);

    AssetCategoryResponse updateCategory(Long id, AssetCategoryRequest request);

    void deleteCategory(Long id);

}