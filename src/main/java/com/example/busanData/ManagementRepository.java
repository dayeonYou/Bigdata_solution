package com.example.busanData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ManagementRepository extends JpaRepository<Management, Integer> {
    List<Management> findByQueryStartDateGreaterThanEqualAndQueryEndDateLessThanEqual(Date startDate, Date endDate);
}
