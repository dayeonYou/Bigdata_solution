package com.example.busanData;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

@Table(name = "User")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;

    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        admin, driver, investigator, cleaner
    }

}
