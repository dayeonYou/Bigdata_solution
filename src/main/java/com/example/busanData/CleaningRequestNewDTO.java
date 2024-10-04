package com.example.busanData;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CleaningRequestNewDTO {

    private PositionDTO position;  // 위도와 경도를 포함하는 position 필드
    private String image;          // 이미지 URL
    private String coast_name;     // 해안 이름
    private int collected_amount;  // 수거된 쓰레기 양
}
