package com.shruti.AssetFlow.repositories;

import com.shruti.AssetFlow.entities.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {

    boolean existsByName(String name);

}