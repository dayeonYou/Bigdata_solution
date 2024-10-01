package com.example.busanData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

        Optional<User> user = userRepository.findById(request.getUser_id());
        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid User ID");
        }

        Cleaning cleaning = new Cleaning();
        cleaning.setUser(user.get());
        cleaning.setPhoto_url(request.getPhoto_url());
        cleaning.setTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now());
        cleaning.setLocation(request.getLocation());
        cleaning.setCoast_name(request.getCoast_name());
        cleaning.setLength(request.getLength());
        cleaning.setCollected_amount(request.getCollected_amount());
        cleaning.setWaste_type(request.getWaste_type());

        cleaningRepository.save(cleaning);

        return ResponseEntity.ok().body(
                new CleaningResponse("success", cleaning.getCleaning_id())
        );
    }
}
