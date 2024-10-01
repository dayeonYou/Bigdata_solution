package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location")
public class LocationAnalysisController {

    @Autowired
    private LocationAnalysisService locationAnalysisService;

    @PostMapping("/analysis")
    public ResponseEntity<?> createLocationAnalysis(@RequestBody LocationAnalysis locationAnalysis) {
        LocationAnalysis createdAnalysis = locationAnalysisService.createLocationAnalysis(locationAnalysis);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ResponseMessage("success", createdAnalysis.getLocation_id())
        );
    }

    // 응답 메시지 클래스
    public static class ResponseMessage {
        private String status;
        private int location_id;

        public ResponseMessage(String status, int location_id) {
            this.status = status;
            this.location_id = location_id;
        }

        public String getStatus() {
            return status;
        }

        public int getLocation_id() {
            return location_id;
        }
    }
}
