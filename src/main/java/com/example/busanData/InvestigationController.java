package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://10.30.0.130:3000")  // 허용할 도메인 명시
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
        investigation.setPollution_level(Investigation.PollutionLevel.fromString(request.getPollution_level()));
        investigation.setWaste_type(request.getWaste_type());  // Use int value directly


        investigationRepository.save(investigation);

        return ResponseEntity.ok().body(
                new InvestigationResponse("success", investigation.getInvestigation_id())
        );
    }

    // 모든 Investigation 데이터를 반환하는 새로운 API 추가
    @GetMapping("/investigations")
    public ResponseEntity<List<Investigation>> getAllInvestigations() {
        List<Investigation> investigations = investigationRepository.findAll();
        return ResponseEntity.ok(investigations);
    }
}
