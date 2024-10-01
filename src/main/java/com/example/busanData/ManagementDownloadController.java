package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/management")
public class ManagementDownloadController {

    @Autowired
    private ManagementRepository managementRepository;

    @PostMapping("/download")
    public ResponseEntity<DownloadResponse> downloadFile(@RequestBody DownloadRequest request) {
        // log_id로 Management 엔티티를 조회
        Optional<Management> managementLog = managementRepository.findById(request.getLog_id());

        if (managementLog.isPresent()) {
            Management log = managementLog.get();
            String resultsFileUrl = log.getResultsFileUrl();

            if (resultsFileUrl != null) {
                // 파일 URL이 존재하면 응답 반환
                return ResponseEntity.ok(new DownloadResponse("success", resultsFileUrl));
            } else {
                return ResponseEntity.badRequest().body(new DownloadResponse("error", "File URL not found"));
            }
        } else {
            return ResponseEntity.badRequest().body(new DownloadResponse("error", "Log not found"));
        }
    }

    // 요청 본문을 위한 클래스
    public static class DownloadRequest {
        private int log_id;

        public int getLog_id() {
            return log_id;
        }

        public void setLog_id(int log_id) {
            this.log_id = log_id;
        }
    }

    // 응답 본문을 위한 클래스
    public static class DownloadResponse {
        private String status;
        private String file_url;

        public DownloadResponse(String status, String file_url) {
            this.status = status;
            this.file_url = file_url;
        }

        public String getStatus() {
            return status;
        }

        public String getFile_url() {
            return file_url;
        }
    }
}
