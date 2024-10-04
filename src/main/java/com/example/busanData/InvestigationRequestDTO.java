package com.example.busanData;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvestigationRequestDTO {

    private String username; // user_id를 username으로 변경
    private String photo_url;
    private LocalDateTime timestamp;
    private String coast_name;
    private double length;
    private String pollution_level;
    private String waste_type;

    // 위도와 경도 추가
    private double latitude;
    private double longitude;
}
