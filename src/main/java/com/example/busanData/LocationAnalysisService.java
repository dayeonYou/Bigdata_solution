package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationAnalysisService {

    @Autowired
    private LocationAnalysisRepository locationAnalysisRepository;

    public LocationAnalysis createLocationAnalysis(LocationAnalysis locationAnalysis) {
        return locationAnalysisRepository.save(locationAnalysis);
    }
}
