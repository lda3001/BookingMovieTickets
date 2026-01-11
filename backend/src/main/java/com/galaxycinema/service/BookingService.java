package com.galaxycinema.service;

import com.galaxycinema.entity.*;
import com.galaxycinema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BookedSeatRepository bookedSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public List<Booking> getUserBookings(Long userId) {
        
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingByCode(String bookingCode, Long userId) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getUser().getId() != userId) {
            throw new RuntimeException("You are not authorized to access this booking");
        }
        return booking;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Transactional
    public Booking createBooking(Long userId, Long showtimeId, List<String> seatCodes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // Fetch room to avoid LazyInitializationException
        Room room = showtime.getRoom();
        if (room == null) {
            throw new RuntimeException("Showtime room not found");
        }

        // Check if seats are available
        List<String> bookedSeats = bookedSeatRepository.findBookedSeatCodesByShowtimeId(showtimeId);
        for (String seatCode : seatCodes) {
            if (bookedSeats.contains(seatCode)) {
                throw new RuntimeException("Seat " + seatCode + " is already booked");
            }
        }

        Booking booking = Booking.builder()
                .user(user)
                .showtime(showtime)
                .status(Booking.BookingStatus.PENDING)
                .build();
        
        double totalPrice = 0.0;
        
        for (String seatCode : seatCodes) {
            Seat seat = seatRepository.findBySeatCodeAndRoomId(seatCode, room.getId())
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + seatCode));
            
            BookedSeat bookedSeat = BookedSeat.builder()
                    .booking(booking)
                    .showtime(showtime)
                    .seat(seat)
                    .seatCode(seatCode)
                    .price(seat.getPrice())
                    .build();
            
            booking.getBookedSeats().add(bookedSeat);
            totalPrice += seat.getPrice();
        }
        
        booking.setTotalPrice(totalPrice);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Save booked seats
        for (BookedSeat bookedSeat : booking.getBookedSeats()) {
            bookedSeat.setBooking(savedBooking);
            bookedSeatRepository.save(bookedSeat);
        }
        
        return savedBooking;
    }

    @Transactional
    public Booking confirmBooking(String bookingCode, String paymentMethod) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

                RestTemplate restTemplate = new RestTemplate();

                String url = "http://localhost:8668/api/payment/initiate";
                String response = restTemplate.getForObject(url, String.class);

        
             
                booking.setPaymentMethod(paymentMethod);
                
        
        
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        // Delete booked seats
        bookedSeatRepository.deleteAll(booking.getBookedSeats());
    }
}

