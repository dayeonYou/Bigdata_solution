package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.core.io.ByteArrayResource;  // 추가
import org.springframework.util.MultiValueMap;

import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/management")
public class ManagementController {

    @Autowired
    private InvestigationRepository investigationRepository;

    private final RestTemplate restTemplate = new RestTemplate(); // For sending HTTP requests

    @GetMapping("/export-investigation")
    public ResponseEntity<Map<String, String>> exportAndSendInvestigationCSV(
            @RequestParam("start_date") String startDateString,
            @RequestParam("end_date") String endDateString) {
        try {
            // 1. Parse the input strings into LocalDateTime
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime startDate = LocalDateTime.parse(startDateString + " 00:00:00", formatter);
            LocalDateTime endDate = LocalDateTime.parse(endDateString + " 23:59:59", formatter);

            // 2. Query the investigation table using LocalDateTime
            List<Investigation> investigationLogs = investigationRepository.findByTimestampBetween(startDate, endDate);

            // 3. Generate CSV
            String csvData = generateInvestigationCSV(investigationLogs);

            // 4. Send the CSV file to the Flask server
            String flaskServerUrl = "http://localhost:5000/api/upload-csv"; // Flask server URL
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(csvData.getBytes()) {
                @Override
                public String getFilename() {
                    return "investigation.csv"; // Filename to be sent to Flask
                }
            });
            body.add("start_date", startDateString);
            body.add("end_date", endDateString);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(flaskServerUrl, HttpMethod.POST, requestEntity, Map.class);

            // Get the file URLs (links) from Flask response
            String coastlineHistogramLink = (String) response.getBody().get("coastline_histogram");
            String predictionHistogramLink = (String) response.getBody().get("prediction_histogram");
            String wastePredictionMapLink = (String) response.getBody().get("waste_prediction_map");
            String wasteMapLink = (String) response.getBody().get("waste_map");

            // Prepare response for the frontend with links
            Map<String, String> responseLinks = Map.of(
                    "coastline_histogram", coastlineHistogramLink,
                    "prediction_histogram", predictionHistogramLink,
                    "waste_prediction_map", wastePredictionMapLink,
                    "waste_map", wasteMapLink
            );

            return new ResponseEntity<>(responseLinks, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Helper method to generate CSV from the investigation logs
    private String generateInvestigationCSV(List<Investigation> investigationLogs) throws IOException {
        StringWriter writer = new StringWriter();

        // Set UTF-8 encoding for the CSV content
        writer.append('\uFEFF'); // BOM (Byte Order Mark) for UTF-8

        writer.append("investigation_id,username,photo_url,timestamp,coast_name,length,pollution_level,waste_type,prediction,latitude,longitude\n");

        for (Investigation log : investigationLogs) {
            // 기본형(int, double 등)은 null 체크가 필요 없음
            writer.append(String.valueOf(log.getInvestigation_id()))  // 기본형은 null 처리 불필요
                    .append(',')
                    .append(log.getUsername() != null ? log.getUsername() : "")  // null 처리
                    .append(',')
                    .append(log.getPhoto_url() != null ? log.getPhoto_url() : "")  // null 처리
                    .append(',')
                    .append(log.getTimestamp() != null ? log.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "")  // null 처리
                    .append(',')
                    .append(log.getCoast_name() != null ? log.getCoast_name() : "")  // null 처리
                    .append(',')
                    .append(String.valueOf(log.getLength()))  // 기본형은 null 처리 불필요
                    .append(',')
                    .append(log.getPollution_level() != null ? log.getPollution_level().toString() : "")  // null 처리
                    .append(',')
                    .append(String.valueOf(log.getWaste_type()))
                    .append(',')
                    .append(log.getPrediction() != null ? log.getPrediction().toString() : "")  // null 처리
                    .append(',')
                    .append(String.valueOf(log.getLatitude()))  // 기본형은 null 처리 불필요
                    .append(',')
                    .append(String.valueOf(log.getLongitude()))  // 기본형은 null 처리 불필요
                    .append('\n');
        }

        return writer.toString();
    }
    @GetMapping("/get-firebase-image-url")
    public ResponseEntity<Map<String, String>> getFirebaseImageUrl(@RequestParam String fileName) {
        try {
            // Flask 서버의 API 호출
            String flaskServerUrl = "http://localhost:5000/api/get-image-url?file_name=" + fileName;
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.getForEntity(flaskServerUrl, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                // Flask 서버에서 받은 이미지 URL을 프론트엔드로 반환
                String fileUrl = (String) response.getBody().get("file_url");
                return ResponseEntity.ok(Map.of("file_url", fileUrl));
            } else {
                return ResponseEntity.status(response.getStatusCode()).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
