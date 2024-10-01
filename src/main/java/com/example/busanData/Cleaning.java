package com.example.busanData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Cleaning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cleaning_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String photo_url;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String location;
    private String coast_name;
    private double length;

    private double collected_amount;
    private String waste_type;

}
