package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")  // 허용할 도메인 명시
@RestController
@RequestMapping("/api")
public class InvestigationController {

    @Autowired
    private InvestigationRepository investigationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/investigation")
    public ResponseEntity<?> createInvestigation(@RequestBody InvestigationRequestDTO request) {

        // username을 이용한 사용자 조회
        Optional<User> user = userRepository.findOptionalByUsername(request.getUsername());
        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid Username");
        }

        Investigation investigation = new Investigation();
        investigation.setUsername(request.getUsername());  // username 설정
        investigation.setPhoto_url(request.getPhoto_url());
        investigation.setTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now());
        investigation.setCoast_name(request.getCoast_name());
        investigation.setLength(request.getLength());
        investigation.setLatitude(request.getLatitude());  // 위도 설정
        investigation.setLongitude(request.getLongitude()); // 경도 설정
        investigation.setPollution_level(Investigation.PollutionLevel.valueOf(request.getPollution_level().toUpperCase()));
        investigation.setWaste_type(request.getWaste_type());  // Use int value directly


        investigationRepository.save(investigation);

        return ResponseEntity.ok().body(
                new InvestigationResponse("success", investigation.getInvestigation_id())
        );
    }
}
