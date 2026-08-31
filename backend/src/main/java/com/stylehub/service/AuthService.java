package com.stylehub.service;
import com.stylehub.dto.*;
import com.stylehub.exception.BadRequestException;
import com.stylehub.model.*;
import com.stylehub.repository.UserRepository;
import com.stylehub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsServiceImpl uds;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) throw new BadRequestException("Email already registered");
        User user = new User();
        user.setName(req.getName()); user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone()); user.setRole(Role.ROLE_USER);
        userRepository.save(user);
        var ud = uds.loadUserByUsername(user.getEmail());
        return new AuthResponse(jwtUtil.generateToken(ud), user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new BadRequestException("Invalid credentials"));
        var ud = uds.loadUserByUsername(user.getEmail());
        return new AuthResponse(jwtUtil.generateToken(ud), user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
