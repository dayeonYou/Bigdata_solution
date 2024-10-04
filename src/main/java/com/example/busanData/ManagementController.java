package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/management")
public class ManagementController {

    @Autowired
    private InvestigationRepository investigationRepository;

    private final RestTemplate restTemplate = new RestTemplate(); // For sending HTTP requests

    @GetMapping("/export-investigation")
    public ResponseEntity<List<String>> exportAndSendInvestigationCSV(
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

            ByteArrayResource fileResource = new ByteArrayResource(csvData.getBytes()) {
                @Override
                public String getFilename() {
                    return "investigate.csv"; // Filename to be sent to Flask
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<List<String>> flaskResponse = restTemplate.exchange(flaskServerUrl, HttpMethod.POST, requestEntity, (Class<List<String>>) (Class<?>) List.class);

            // 5. Return the list of file URLs from Flask server
            if (flaskResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(flaskResponse.getBody());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

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
            writer.append(String.valueOf(log.getInvestigation_id()))
                    .append(',')
                    .append(log.getUsername() != null ? log.getUsername() : "")
                    .append(',')
                    .append(log.getPhoto_url() != null ? log.getPhoto_url() : "")
                    .append(',')
                    .append(log.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .append(',')
                    .append(log.getCoast_name() != null ? log.getCoast_name() : "")
                    .append(',')
                    .append(String.valueOf(log.getLength()))
                    .append(',')
                    .append(log.getPollution_level() != null ? log.getPollution_level().toString() : "")
                    .append(',')
                    .append(String.valueOf(log.getWaste_type()))
                    .append(',')
                    .append(log.getPrediction() != null ? log.getPrediction().toString() : "")
                    .append(',')
                    .append(String.valueOf(log.getLatitude()))
                    .append(',')
                    .append(String.valueOf(log.getLongitude()))
                    .append('\n');
        }

        return writer.toString();
    }
}
