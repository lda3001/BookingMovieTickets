package com.galaxycinema.repository;

import com.galaxycinema.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    @Query("SELECT s FROM Showtime s LEFT JOIN FETCH s.room WHERE s.movie.id = :movieId AND s.isActive = true ORDER BY s.showTime")
    List<Showtime> findByMovieId(@Param("movieId") Long movieId);
    
    @Query("SELECT s FROM Showtime s LEFT JOIN FETCH s.room WHERE s.movie.id = :movieId AND s.cinema.id = :cinemaId AND DATE(s.showTime) = :date AND s.isActive = true ORDER BY s.showTime")
    List<Showtime> findByMovieAndCinemaAndDate(@Param("movieId") Long movieId, 
                                                 @Param("cinemaId") Long cinemaId, 
                                                 @Param("date") LocalDate date);
    
    @Query("SELECT DISTINCT DATE(s.showTime) FROM Showtime s WHERE s.movie.id = :movieId AND s.cinema.id = :cinemaId AND s.showTime >= CURRENT_DATE AND s.isActive = true ORDER BY DATE(s.showTime)")
    List<LocalDate> findAvailableDates(@Param("movieId") Long movieId, @Param("cinemaId") Long cinemaId);
    
    List<Showtime> findByShowTimeBetween(LocalDateTime start, LocalDateTime end);
}

