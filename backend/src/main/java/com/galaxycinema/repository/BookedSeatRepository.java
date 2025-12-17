package com.galaxycinema.repository;

import com.galaxycinema.entity.BookedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookedSeatRepository extends JpaRepository<BookedSeat, Long> {
    @Query("SELECT bs.seatCode FROM BookedSeat bs WHERE bs.showtime.id = :showtimeId")
    List<String> findBookedSeatCodesByShowtimeId(@Param("showtimeId") Long showtimeId);
    
    List<BookedSeat> findByShowtimeId(Long showtimeId);
}

