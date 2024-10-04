package com.example.busanData;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface CleaningRepository extends JpaRepository<Cleaning, Integer> {

    // Custom method to find cleaning records between two timestamps
    List<Cleaning> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
}
