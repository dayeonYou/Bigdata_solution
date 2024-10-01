package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/management")
public class ManagementController {

    @Autowired
    private ManagementRepository managementRepository;

    @GetMapping
    public ResponseEntity<List<Management>> getManagementLogs(
            @RequestParam("start_date") String startDateString,
            @RequestParam("end_date") String endDateString) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateString);
            Date endDate = dateFormat.parse(endDateString);

            List<Management> managementLogs = managementRepository.findByQueryStartDateGreaterThanEqualAndQueryEndDateLessThanEqual(startDate, endDate);
            return ResponseEntity.ok(managementLogs);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
