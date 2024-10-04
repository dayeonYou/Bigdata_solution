package com.example.busanData;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username); // 사용자 이름으로 User 반환
    Optional<User> findOptionalByUsername(String username); // 사용자 이름으로 Optional<User> 반환
}
