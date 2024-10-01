package com.example.busanData;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CleaningRequestDTO {

    private int user_id;
    private String photo_url;
    private LocalDateTime timestamp;
    private String location;
    private String coast_name;
    private double length;
    private double collected_amount;
    private String waste_type;

}
