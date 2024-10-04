package com.example.busanData;

import com.example.busanData.Investigation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InvestigationRepository extends JpaRepository<Investigation, Integer> {
    List<Investigation> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
}
