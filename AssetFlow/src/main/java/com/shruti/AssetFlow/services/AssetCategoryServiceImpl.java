package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.assetcategory.AssetCategoryRequest;
import com.shruti.AssetFlow.dto.assetcategory.AssetCategoryResponse;
import com.shruti.AssetFlow.entities.AssetCategory;
import com.shruti.AssetFlow.exception.DuplicateResourceException;
import com.shruti.AssetFlow.exception.ResourceNotFoundException;
import com.shruti.AssetFlow.repositories.AssetCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetCategoryServiceImpl implements AssetCategoryService {

    private final AssetCategoryRepository assetCategoryRepository;

    @Override
    public AssetCategoryResponse createCategory(AssetCategoryRequest request) {

        if(assetCategoryRepository.existsByName(request.getName())){
            throw new DuplicateResourceException("Category already exists.");
        }

        AssetCategory category = AssetCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        AssetCategory savedCategory = assetCategoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    public List<AssetCategoryResponse> getAllCategories() {

        return assetCategoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AssetCategoryResponse getCategoryById(Long id) {

        AssetCategory category = assetCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id : " + id));

        return mapToResponse(category);
    }

    @Override
    public AssetCategoryResponse updateCategory(Long id,
                                                AssetCategoryRequest request) {

        AssetCategory category = assetCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id : " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        AssetCategory updated = assetCategoryRepository.save(category);

        return mapToResponse(updated);
    }

    @Override
    public void deleteCategory(Long id) {

        AssetCategory category = assetCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id : " + id));

        assetCategoryRepository.delete(category);
    }

    private AssetCategoryResponse mapToResponse(AssetCategory category){

        return AssetCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}