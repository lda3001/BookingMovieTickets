package com.galaxycinema.repository;

import com.galaxycinema.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByRoomId(Long roomId);
    
    Optional<Seat> findBySeatCodeAndRoomId(String seatCode, Long roomId);
}

