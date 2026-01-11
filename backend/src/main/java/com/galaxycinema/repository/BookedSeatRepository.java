package com.galaxycinema.repository;

import com.galaxycinema.entity.BookedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookedSeatRepository extends JpaRepository<BookedSeat, Long> {
        @Query("""
        SELECT bs.seatCode
        FROM BookedSeat bs
        JOIN bs.booking b
        WHERE bs.showtime.id = :showtimeId
        AND b.status = 'CONFIRMED'
        AND b.paymentStatus = 'PAID'
    """)
    List<String> findBookedSeatCodesByShowtimeId(@Param("showtimeId") Long showtimeId);

    
    List<BookedSeat> findByShowtimeId(Long showtimeId);
}

