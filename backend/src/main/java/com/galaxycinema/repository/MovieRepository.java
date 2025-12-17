package com.galaxycinema.repository;

import com.galaxycinema.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findBySlug(String slug);
    
    List<Movie> findByIsActiveTrue();
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true AND (m.releaseDate IS NULL OR m.releaseDate <= CURRENT_DATE)")
    List<Movie> findNowShowing();
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true AND m.releaseDate > CURRENT_DATE")
    List<Movie> findComingSoon();
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true AND m.releaseDate BETWEEN :startDate AND :endDate")
    List<Movie> findByReleaseDateBetween(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true AND YEAR(m.releaseDate) = :year")
    List<Movie> findByReleaseYear(@Param("year") int year);
}

