package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationAnalysisService {

    @Autowired
    private LocationAnalysisRepository locationAnalysisRepository;
    @Autowired
    private CleaningRepository cleaningRepository;

    public LocationAnalysis createLocationAnalysis(LocationAnalysis locationAnalysis) {
        return locationAnalysisRepository.save(locationAnalysis);
    }
    public List<Cleaning> getCleaningLogs() {
        return cleaningRepository.findAll();  // 모든 Cleaning 데이터를 가져옴
    }
}
