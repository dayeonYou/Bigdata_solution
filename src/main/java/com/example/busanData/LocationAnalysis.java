package com.example.busanData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "locationanalysis")
public class LocationAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int location_id;

    private String location_name;
    private double total_waste_collected;

    @Embedded
    private WasteDistribution waste_distribution;

    private double collection_prediction;
}
