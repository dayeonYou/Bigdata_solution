package com.example.busanData;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvestigationResponse {

    private String status;
    private int investigation_id;

    public InvestigationResponse(String status, int investigation_id) {
        this.status = status;
        this.investigation_id = investigation_id;
    }

    // Getters and Setters
}
