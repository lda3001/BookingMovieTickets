package com.galaxycinema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BookingApplication {
    public static void main(String[] args) {

//        System.out.println("JAVA_HOME = " + System.getProperty("java.home"));
//        System.out.println("Java version = " + Runtime.version());
        SpringApplication.run(BookingApplication.class, args);
    }
}

