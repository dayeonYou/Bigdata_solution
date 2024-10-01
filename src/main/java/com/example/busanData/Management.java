package com.example.busanData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "management")
public class Management {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long log_id;

    @Column(name = "query_start_date")
    private Date queryStartDate;

    @Column(name = "query_end_date")
    private Date queryEndDate;

    @Column(name = "results_file_url")
    private String resultsFileUrl;

    @Column(name = "download_status")
    private String downloadStatus;
    // Getters and Setters
}

