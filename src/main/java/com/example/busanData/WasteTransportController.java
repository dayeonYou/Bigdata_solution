package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class WasteTransportController {

    @Autowired
    private WasteTransportRepository wasteTransportRepository;

    @PostMapping("/transport")
    public ResponseEntity<?> createTransportEntry(@RequestBody WasteTransport transport) {
        // 운송량 기록을 데이터베이스에 저장
        WasteTransport savedTransport = wasteTransportRepository.save(transport);

        // 성공적인 응답 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ResponseMessage("success", savedTransport.getTransport_id())
        );
    }

    public static class ResponseMessage {
        private String status;
        private int transport_id;

        public ResponseMessage(String status, int transport_id) {
            this.status = status;
            this.transport_id = transport_id;
        }

        public int getTransportId() {
            return transport_id;
        }
    }
}
