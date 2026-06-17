package com.galaxycinema.repository;

import com.galaxycinema.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
    
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.showtime.id = :showtimeId")
    List<Booking> findByShowtimeId(@Param("showtimeId") Long showtimeId);

    @Query("""
        SELECT DISTINCT b
        FROM Booking b
        LEFT JOIN FETCH b.bookedSeats
        WHERE b.status = :status
        AND b.createdAt <= :expiredBefore
        AND (b.paymentStatus IS NULL OR UPPER(b.paymentStatus) <> :paidStatus)
    """)
    List<Booking> findExpiredUnpaidBookings(
            @Param("status") Booking.BookingStatus status,
            @Param("expiredBefore") LocalDateTime expiredBefore,
            @Param("paidStatus") String paidStatus
    );
}

