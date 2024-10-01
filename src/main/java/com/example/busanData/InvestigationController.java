package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class InvestigationController {

    @Autowired
    private InvestigationRepository investigationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/investigation")
    public ResponseEntity<?> createInvestigation(@RequestBody InvestigationRequestDTO request) {

        Optional<User> user = userRepository.findById(request.getUser_id());
        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid User ID");
        }

        Investigation investigation = new Investigation();
        investigation.setUser(user.get());
        investigation.setPhoto_url(request.getPhoto_url());
        investigation.setTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now());
        investigation.setLocation(request.getLocation());
        investigation.setCoast_name(request.getCoast_name());
        investigation.setLength(request.getLength());
        investigation.setPollution_level(Investigation.PollutionLevel.valueOf(request.getPollution_level().toUpperCase()));
        investigation.setWaste_type(request.getWaste_type());

        investigationRepository.save(investigation);

        return ResponseEntity.ok().body(
                new InvestigationResponse("success", investigation.getInvestigation_id())
        );
    }
}
