// CleaningResponseNewDTO.java
package com.example.busanData;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CleaningResponseNewDTO {
    private PositionDTO position;
    private String image;
    private String coast_name;
    private int collected_amount;
}
