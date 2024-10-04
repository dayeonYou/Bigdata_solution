package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CleaningController {

    @Autowired
    private CleaningRepository cleaningRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/cleaning")
    public ResponseEntity<?> createCleaning(@RequestBody CleaningRequestDTO request) {

        // username을 이용하여 User 조회
        Optional<User> user = userRepository.findOptionalByUsername(request.getUsername());
        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid Username");
        }

        Cleaning cleaning = new Cleaning();
        cleaning.setUser(user.get());
        cleaning.setPhoto_url(request.getPhoto_url());
        cleaning.setTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now());
        cleaning.setCoast_name(request.getCoast_name());
        cleaning.setLength(request.getLength());
        cleaning.setCollected_amount(request.getCollected_amount());
        cleaning.setWaste_type(request.getWaste_type());
        cleaning.setLatitude(BigDecimal.valueOf(request.getLatitude()));
        cleaning.setLongitude(BigDecimal.valueOf(request.getLongitude()));
        cleaning.setTotal_amount(request.getTotal_amount());

        cleaningRepository.save(cleaning);

        return ResponseEntity.ok().body(
                new CleaningResponse("success", cleaning.getCleaning_id())
        );
    }
    @GetMapping("/cleaning-info")
    public ResponseEntity<List<CleaningResponseNewDTO>> getCleaningInfo() {
        // 데이터베이스에서 모든 Cleaning 엔티티를 가져옵니다.
        List<Cleaning> cleaningList = cleaningRepository.findAll();

        // 응답 리스트 초기화
        List<CleaningResponseNewDTO> responseList = new ArrayList<>();

        // 각 Cleaning 엔티티에 대해 응답 DTO로 변환
        for (Cleaning cleaning : cleaningList) {
            PositionDTO position = new PositionDTO();
            position.setLat(cleaning.getLatitude().doubleValue()); // BigDecimal을 double로 변환
            position.setLng(cleaning.getLongitude().doubleValue()); // BigDecimal을 double로 변환

            CleaningResponseNewDTO responseDTO = new CleaningResponseNewDTO(
                    position,
                    cleaning.getPhoto_url(),
                    cleaning.getCoast_name(),
                    cleaning.getCollected_amount()
            );

            responseList.add(responseDTO);
        }

        // 리스트로 응답
        return ResponseEntity.ok(responseList);
    }

}
