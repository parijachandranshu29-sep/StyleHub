package com.stylehub.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity @Table(name="users") @Data @NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=100) private String name;
    @Column(nullable=false,unique=true,length=150) private String email;
    @Column(nullable=false) private String password;
    @Column(length=20) private String phone;
    @Column(length=255) private String address;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role=Role.ROLE_USER;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt=LocalDateTime.now();
}
