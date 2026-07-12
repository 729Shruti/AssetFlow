package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.asset.AssetRequest;
import com.shruti.AssetFlow.dto.asset.AssetResponse;
import com.shruti.AssetFlow.entities.Asset;
import com.shruti.AssetFlow.entities.AssetCategory;
import com.shruti.AssetFlow.entities.Department;
import com.shruti.AssetFlow.entities.enums.AssetCondition;
import com.shruti.AssetFlow.entities.enums.AssetStatus;
import com.shruti.AssetFlow.exception.DuplicateResourceException;
import com.shruti.AssetFlow.exception.ResourceNotFoundException;
import com.shruti.AssetFlow.repositories.AssetCategoryRepository;
import com.shruti.AssetFlow.repositories.AssetRepository;
import com.shruti.AssetFlow.repositories.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final DepartmentRepository departmentRepository;
    private final AssetCategoryRepository assetCategoryRepository;

    @Override
    public AssetResponse createAsset(AssetRequest request) {

        if (assetRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new DuplicateResourceException("Serial number already exists.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id : " + request.getDepartmentId()));

        AssetCategory category = assetCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id : " + request.getCategoryId()));

        Asset asset = Asset.builder()
                .assetTag(generateAssetTag())
                .name(request.getName())
                .serialNumber(request.getSerialNumber())
                .brand(request.getBrand())
                .model(request.getModel())
                .purchaseDate(request.getPurchaseDate())
                .purchaseCost(request.getPurchaseCost())
                .location(request.getLocation())
                .bookable(request.getBookable())
                .status(AssetStatus.AVAILABLE)
                .condition(AssetCondition.NEW)
                .department(department)
                .category(category)
                .build();

        Asset savedAsset = assetRepository.save(asset);

        return mapToResponse(savedAsset);

    }

    @Override
    public List<AssetResponse> getAllAssets() {

        return assetRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AssetResponse getAssetById(Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asset not found with id : " + id));

        return mapToResponse(asset);
    }

    @Override
    public AssetResponse updateAsset(Long id, AssetRequest request) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asset not found with id : " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found."));

        AssetCategory category = assetCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found."));

        asset.setName(request.getName());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setBrand(request.getBrand());
        asset.setModel(request.getModel());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchaseCost(request.getPurchaseCost());
        asset.setLocation(request.getLocation());
        asset.setBookable(request.getBookable());
        asset.setDepartment(department);
        asset.setCategory(category);

        Asset updatedAsset = assetRepository.save(asset);

        return mapToResponse(updatedAsset);
    }

    @Override
    public void deleteAsset(Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asset not found with id : " + id));

        asset.setStatus(AssetStatus.RETIRED);

        assetRepository.save(asset);
    }

    private String generateAssetTag() {

        long count = assetRepository.count() + 1;

        return String.format("AST%03d", count);
    }

    private AssetResponse mapToResponse(Asset asset) {

        return AssetResponse.builder()
                .id(asset.getId())
                .assetTag(asset.getAssetTag())
                .name(asset.getName())
                .serialNumber(asset.getSerialNumber())
                .brand(asset.getBrand())
                .model(asset.getModel())
                .department(asset.getDepartment().getName())
                .category(asset.getCategory().getName())
                .location(asset.getLocation())
                .status(asset.getStatus())
                .condition(asset.getCondition())
                .bookable(asset.getBookable())
                .build();
    }
}