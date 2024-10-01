package com.example.busanData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "WasteTransport")
public class WasteTransport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transport_id;

    private int driver_id;

    private double transport_volume;

    @Column(columnDefinition = "TEXT")
    private String expected_route;

    private boolean completion_status;

    // 추가적인 필드나 메소드가 필요하면 여기에 작성
}
