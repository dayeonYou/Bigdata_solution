package com.example.busanData;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CleaningResponse {

    private String status;
    private int cleaning_id;

    public CleaningResponse(String status, int cleaning_id) {
        this.status = status;
        this.cleaning_id = cleaning_id;
    }

}
