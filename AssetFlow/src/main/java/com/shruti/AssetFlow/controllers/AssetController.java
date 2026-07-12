package com.shruti.AssetFlow.controllers;

import com.shruti.AssetFlow.dto.asset.AssetRequest;
import com.shruti.AssetFlow.dto.asset.AssetResponse;
import com.shruti.AssetFlow.services.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssetResponse createAsset(@Valid @RequestBody AssetRequest request) {
        return assetService.createAsset(request);
    }

    @GetMapping
    public List<AssetResponse> getAllAssets() {
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public AssetResponse getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PutMapping("/{id}")
    public AssetResponse updateAsset(@PathVariable Long id,
                                     @Valid @RequestBody AssetRequest request) {
        return assetService.updateAsset(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }
}