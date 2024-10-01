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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // org.apache.catalina.User 대신 직접 정의한 User 엔티티 사용

    private String photo_url;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String location;
    private String coast_name;
    private double length;

    @Enumerated(EnumType.STRING)
    private PollutionLevel pollution_level;

    private String waste_type;

    public enum PollutionLevel {
        LOW, MEDIUM, HIGH
    }

    // 필요한 생성자, Getter, Setter들 추가
}
