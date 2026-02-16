package com.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * LateComerApp - Main Entry Point
 * * This Spring Boot application acts as a secure middleware between the 
 * Vanilla JS Frontend and the SeaTable Database. 
 * * Responsibilities:
 * 1. Bootstrapping the Spring context.
 * 2. Configuring CORS for local development (allowing the Frontend to connect).
 * 3. Providing the RestTemplate bean for API calls to SeaTable.
 */
@SpringBootApplication
public class LateComerApp {

    public static void main(String[] args) {
        SpringApplication.run(LateComerApp.class, args);
        System.out.println("----------------------------------------------");
        System.out.println("Late Comer Management System Backend Started!");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("----------------------------------------------");
    }

    /**
     * RestTemplate Bean
     * Required by SeaTableService to perform HTTP requests to SeaTable Cloud.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * CORS Configuration
     * Essential to allow your frontend (index.html) to communicate with this 
     * backend when running on different ports or via file protocol.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*") // In production, replace with your specific frontend URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}