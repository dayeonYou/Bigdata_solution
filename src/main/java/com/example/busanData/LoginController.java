package com.example.busanData;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            // Generate a dummy JWT token (you can implement actual JWT token generation here)
            String token = "jwt-token"; // Placeholder for a real JWT token
            return ResponseEntity.ok(new LoginResponse("success", token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    // Request and Response Classes
    @Setter
    @Getter
    public static class LoginRequest {
        // Getters and Setters
        private String username;
        private String password;

    }

    @Getter
    public static class LoginResponse {
        // Getters
        private String status;
        private String token;

        public LoginResponse(String status, String token) {
            this.status = status;
            this.token = token;
        }

    }
}
