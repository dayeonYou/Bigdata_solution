package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationAnalysisController {

    @Autowired
    private LocationAnalysisService locationAnalysisService;

    @PostMapping("/analysis")
    public ResponseEntity<?> createLocationAnalysis() throws IOException {
        // Cleaning 데이터를 가져옴
        List<Cleaning> cleaningLogs = locationAnalysisService.getCleaningLogs();

        // CSV 파일 생성
        String csvData = generateCleaningCSV(cleaningLogs);
        Files.write(Paths.get("C:/user/cleaning_data_test.csv"), csvData.getBytes(StandardCharsets.UTF_8));

        // Flask 서버에 CSV 파일을 전송
        String flaskUrl = "http://localhost:5000/analyze"; // Flask 서버 URL
        RestTemplate restTemplate = new RestTemplate();

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // CSV 데이터를 ByteArrayResource로 감싸서 파일처럼 전송
        ByteArrayResource byteArrayResource = new ByteArrayResource(csvData.getBytes(StandardCharsets.UTF_8)) {
            @Override
            public String getFilename() {
                return "cleaning_data.csv"; // 파일 이름
            }
        };

        // Multipart 전송용 MultiValueMap 생성
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", byteArrayResource);  // CSV 파일 추가

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Flask로 POST 요청
        ResponseEntity<String> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, requestEntity, String.class);

        // Flask 서버로부터 응답받은 결과를 반환
        return ResponseEntity.ok(response.getBody());
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
