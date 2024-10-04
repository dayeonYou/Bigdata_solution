package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.StringWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    private String generateCleaningCSV(List<Cleaning> cleaningLogs) throws IOException {
        StringWriter writer = new StringWriter();
        writer.append('\uFEFF'); // BOM (Byte Order Mark) for UTF-8
        writer.append("cleaning_id,user_id,photo_url,timestamp,coast_name,length,collected_amount,waste_type,latitude,longitude,total_amount\n");

        for (Cleaning log : cleaningLogs) {
            writer.append(String.valueOf(log.getCleaning_id()))
                    .append(',')
                    .append(String.valueOf(log.getUser().getUser_id()))  // Assuming User has a getUserId() method
                    .append(',')
                    .append(log.getPhoto_url() != null ? log.getPhoto_url() : "")
                    .append(',')
                    .append(log.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .append(',')
                    .append(log.getCoast_name() != null ? log.getCoast_name() : "")
                    .append(',')
                    .append(String.valueOf(log.getLength()))
                    .append(',')
                    .append(String.valueOf(log.getCollected_amount()))
                    .append(',')
                    .append(String.valueOf(log.getWaste_type()))
                    .append(',')
                    .append(log.getLatitude() != null ? log.getLatitude().toString() : "")
                    .append(',')
                    .append(log.getLongitude() != null ? log.getLongitude().toString() : "")
                    .append(',')
                    .append(String.valueOf(log.getTotal_amount()))
                    .append('\n');
        }

        return writer.toString();
    }
}
