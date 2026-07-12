package com.shruti.AssetFlow.repositories;

import com.shruti.AssetFlow.entities.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    boolean existsByAssetTag(String assetTag);

    boolean existsBySerialNumber(String serialNumber);

}