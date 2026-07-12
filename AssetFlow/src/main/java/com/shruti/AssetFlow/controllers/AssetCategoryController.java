package com.shruti.AssetFlow.controllers;

import com.shruti.AssetFlow.dto.assetcategory.AssetCategoryRequest;
import com.shruti.AssetFlow.dto.assetcategory.AssetCategoryResponse;
import com.shruti.AssetFlow.services.AssetCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class AssetCategoryController {

    private final AssetCategoryService assetCategoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssetCategoryResponse createCategory(
            @Valid @RequestBody AssetCategoryRequest request){

        return assetCategoryService.createCategory(request);
    }

    @GetMapping
    public List<AssetCategoryResponse> getAllCategories(){

        return assetCategoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public AssetCategoryResponse getCategory(@PathVariable Long id){

        return assetCategoryService.getCategoryById(id);
    }

    @PutMapping("/{id}")
    public AssetCategoryResponse updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody AssetCategoryRequest request){

        return assetCategoryService.updateCategory(id,request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id){

        assetCategoryService.deleteCategory(id);
    }
}