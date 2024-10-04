package com.example.busanData;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CleaningRequestDTO {

    private String username;
    private String photo_url;
    private LocalDateTime timestamp;
    private String coast_name;
    private double length;
    private int collected_amount;
    private int waste_type;
    private double latitude;  // 위도
    private double longitude; // 경도
    private int total_amount;
}
