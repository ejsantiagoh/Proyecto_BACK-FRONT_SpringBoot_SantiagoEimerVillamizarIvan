package com.c4.atunesdelpacifico;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class MainPrueba {
    public static void main(String[] args) {
    System.out.println(new BCryptPasswordEncoder().encode("admin123"));
    System.out.println(new BCryptPasswordEncoder().encode("op1234567"));
    System.out.println(new BCryptPasswordEncoder().encode("norte123"));
    System.out.println(new BCryptPasswordEncoder().encode("sur123"));
}
}
