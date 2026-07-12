package com.shruti.AssetFlow.services;

import com.shruti.AssetFlow.dto.asset.AssetRequest;
import com.shruti.AssetFlow.dto.asset.AssetResponse;

import java.util.List;

public interface AssetService {

    AssetResponse createAsset(AssetRequest request);

    List<AssetResponse> getAllAssets();

    AssetResponse getAssetById(Long id);

    AssetResponse updateAsset(Long id, AssetRequest request);

    void deleteAsset(Long id);

}