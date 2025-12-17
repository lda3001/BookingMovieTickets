package com.galaxycinema.repository;

import com.galaxycinema.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByIsActiveTrue();
    
    List<Room> findByCinemaId(Long cinemaId);
    
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.cinema WHERE r.cinema.id = :cinemaId AND r.isActive = true")
    List<Room> findActiveRoomsByCinemaId(@Param("cinemaId") Long cinemaId);
    
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.cinema WHERE r.id = :id")
    java.util.Optional<Room> findByIdWithCinema(@Param("id") Long id);
}

