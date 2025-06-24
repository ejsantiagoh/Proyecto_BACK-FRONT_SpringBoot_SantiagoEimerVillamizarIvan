package com.c4.atunesdelpacifico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication
public class AtunesdelpacificoApplication {

	public static void main(String[] args) {
		// Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        // System.setProperty("DB_URL", dotenv.get("DB_URL"));
        // System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        // System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		SpringApplication.run(AtunesdelpacificoApplication.class, args);
	}

}
