package com.example.busanData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "driver")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int driver_id;

    private int user_id;
    private String post_cleaning_photo_url;
    private String dropoff_location;
    private String expected_route;

    @Column(nullable = false)
    private boolean completed;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timestamp;

    // 필요한 경우 user_id에 대한 외래 키 매핑 추가
}
