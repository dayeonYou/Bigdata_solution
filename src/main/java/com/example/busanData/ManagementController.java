package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.*;
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
    public ResponseEntity<MultiValueMap<String, InputStreamResource>> exportAndSendInvestigationCSV(
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

            // Get the file paths from Flask response
            String coastlineHistogramPath = (String) response.getBody().get("coastline_histogram");
            String predictionHistogramPath = (String) response.getBody().get("prediction_histogram");
            String wastePredictionMapPath = (String) response.getBody().get("waste_prediction_map");
            String wasteMapPath = (String) response.getBody().get("waste_map");

            // Prepare response for the frontend
            MultiValueMap<String, InputStreamResource> responseResources = new LinkedMultiValueMap<>();

            // Read and attach PNG and HTML files
            InputStreamResource coastlineHistogramResource = new InputStreamResource(new FileInputStream(new File(coastlineHistogramPath)));
            InputStreamResource predictionHistogramResource = new InputStreamResource(new FileInputStream(new File(predictionHistogramPath)));
            InputStreamResource wastePredictionMapResource = new InputStreamResource(new FileInputStream(new File(wastePredictionMapPath)));
            InputStreamResource wasteMapResource = new InputStreamResource(new FileInputStream(new File(wasteMapPath)));

            responseResources.add("coastline_histogram", coastlineHistogramResource);
            responseResources.add("prediction_histogram", predictionHistogramResource);
            responseResources.add("waste_prediction_map", wastePredictionMapResource);
            responseResources.add("waste_map", wasteMapResource);

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

            return new ResponseEntity<>(responseResources, responseHeaders, HttpStatus.OK);

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
