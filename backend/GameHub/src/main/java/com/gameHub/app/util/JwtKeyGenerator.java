package com.gameHub.app.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class JwtKeyGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String jwt = encoder.encode("admin123");

        System.out.println("Generated JWT Key: " + jwt);
    }

}
