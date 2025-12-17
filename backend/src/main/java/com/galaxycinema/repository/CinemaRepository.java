package com.galaxycinema.repository;

import com.galaxycinema.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    List<Cinema> findByIsActiveTrue();
    
    List<Cinema> findByCity(String city);
}

