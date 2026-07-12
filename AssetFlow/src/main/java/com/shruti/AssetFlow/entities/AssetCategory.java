package com.shruti.AssetFlow.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "asset_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Asset> assets;
}