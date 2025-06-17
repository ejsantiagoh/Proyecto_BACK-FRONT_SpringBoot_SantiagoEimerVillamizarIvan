package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.config.JwtUtil;
import com.c4.atunesdelpacifico.dto.AuthRequest;
import com.c4.atunesdelpacifico.dto.AuthResponse;
import com.c4.atunesdelpacifico.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            throw new Exception("Credenciales inválidas", e);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}

// class AuthRequest {
//     private String username;
//     private String password;

//     // Getters y setters
//     public String getUsername() { return username; }
//     public void setUsername(String username) { this.username = username; }
//     public String getPassword() { return password; }
//     public void setPassword(String password) { this.password = password; }
// }

// class AuthResponse {
//     private String token;

//     public AuthResponse(String token) {
//         this.token = token;
//     }

//     public String getToken() { return token; }
//     public void setToken(String token) { this.token = token; }
// }