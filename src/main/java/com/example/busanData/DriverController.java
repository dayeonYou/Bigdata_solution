package com.example.busanData;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @PostMapping("/driver")
    public ResponseEntity<?> createDriverEntry(@RequestBody Driver driver) {
        // 입력된 데이터 유효성 검사 (필요에 따라 추가)

        // 요청받은 시간으로 timestamp 설정
        if (driver.getTimestamp() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage("error", 404));
        }

        Driver savedDriver = driverRepository.save(driver);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ResponseMessage("success", savedDriver.getDriver_id())
        );
    }

    public static class ResponseMessage {
        @Getter
        private String status;
        private int driver_id;

        public ResponseMessage(String status, int driver_id) {
            this.status = status;
            this.driver_id = driver_id;
        }

        public int getDriverId() {
            return driver_id;
        }
    }
}
