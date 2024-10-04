package com.example.busanData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Investigation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int investigation_id;

    // username으로 변경
    private String username;

    private String photo_url;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // location 필드 삭제
    private String coast_name;
    private double length;

    @Column(name = "latitude", nullable = true)
    private double latitude;

    @Column(name = "longitude", nullable = true)
    private double longitude;

    @Enumerated(EnumType.STRING)
    private PollutionLevel pollution_level;

    private int waste_type;

    public enum PollutionLevel {
        LOW, MEDIUM, HIGH
    }

    // 필요한 생성자, Getter, Setter들 추가
}
