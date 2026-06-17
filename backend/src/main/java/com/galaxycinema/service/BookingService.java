package com.galaxycinema.service;

import com.galaxycinema.entity.*;
import com.galaxycinema.repository.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class BookingService {
    private static final String PAID_PAYMENT_STATUS = "PAID";
    private static final double DEFAULT_TICKET_PRICE = 75000.0;
    private static final double VIP_PRICE_MULTIPLIER = 1.2;
    private static final int DEFAULT_TOTAL_ROWS = 10;

    private final BookingRepository bookingRepository;
    private final BookedSeatRepository bookedSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;

    @Value("${booking.payment-timeout-minutes:10}")
    private long paymentTimeoutMinutes;

    @Value("${payment.sync-url:http://localhost:8668/api/payment/sync}")
    private String paymentSyncUrl;

    public List<Booking> getUserBookings(Long userId) {
        cancelExpiredUnpaidBookings();
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Booking getBookingByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        cancelIfExpiredAndUnpaid(booking);
        // if (booking.getUser().getId() != userId) {
        //     throw new RuntimeException("You are not authorized to access this booking");
        // }
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
        cancelExpiredUnpaidBookings();

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
        double baseTicketPrice = resolveBaseTicketPrice(showtime);
        
        for (String seatCode : seatCodes) {
            Seat seat = seatRepository.findBySeatCodeAndRoomId(seatCode, room.getId())
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + seatCode));
            double seatPrice = calculateSeatPrice(seatCode, room, baseTicketPrice);
            
            BookedSeat bookedSeat = BookedSeat.builder()
                    .booking(booking)
                    .showtime(showtime)
                    .seat(seat)
                    .seatCode(seatCode)
                    .price(seatPrice)
                    .build();
            
            booking.getBookedSeats().add(bookedSeat);
            totalPrice += seatPrice;
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

    @Transactional(noRollbackFor = BookingExpiredException.class)
    public Booking confirmBooking(String bookingCode, String paymentMethod) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (cancelIfExpiredAndUnpaid(booking)) {
            throw new BookingExpiredException("Booking payment time has expired");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking has been cancelled");
        }

        RestTemplate restTemplate = new RestTemplate();

        booking.setPaymentMethod(paymentMethod);
        bookingRepository.saveAndFlush(booking);

        restTemplate.getForObject(paymentSyncUrl, String.class);

        entityManager.refresh(booking);
        return booking;
    }

    @Transactional
    public void cancelBooking(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        cancelBookingEntity(booking);
    }

    @Transactional
    public int cancelExpiredUnpaidBookings() {
        LocalDateTime expiredBefore = LocalDateTime.now().minusMinutes(paymentTimeoutMinutes);
        List<Booking> expiredBookings = bookingRepository.findExpiredUnpaidBookings(
                Booking.BookingStatus.PENDING,
                expiredBefore,
                PAID_PAYMENT_STATUS
        );

        expiredBookings.forEach(this::cancelBookingEntity);
        return expiredBookings.size();
    }

    private boolean cancelIfExpiredAndUnpaid(Booking booking) {
        if (booking.getStatus() != Booking.BookingStatus.PENDING || isPaid(booking)) {
            return false;
        }

        LocalDateTime createdAt = booking.getCreatedAt();
        if (createdAt == null) {
            return false;
        }

        LocalDateTime expiredBefore = LocalDateTime.now().minusMinutes(paymentTimeoutMinutes);
        if (createdAt.isAfter(expiredBefore)) {
            return false;
        }

        cancelBookingEntity(booking);
        return true;
    }

    private boolean isPaid(Booking booking) {
        return booking.getPaymentStatus() != null
                && PAID_PAYMENT_STATUS.equalsIgnoreCase(booking.getPaymentStatus());
    }

    private void cancelBookingEntity(Booking booking) {
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        if (booking.getBookedSeats() != null) {
            booking.getBookedSeats().clear();
        }
        bookingRepository.save(booking);
    }

    private double resolveBaseTicketPrice(Showtime showtime) {
        Double price = showtime.getPrice();
        return price != null && price > 0 ? price : DEFAULT_TICKET_PRICE;
    }

    private double calculateSeatPrice(String seatCode, Room room, double baseTicketPrice) {
        return isVipSeat(seatCode, room) ? baseTicketPrice * VIP_PRICE_MULTIPLIER : baseTicketPrice;
    }

    private boolean isVipSeat(String seatCode, Room room) {
        String rowLabel = extractRowLabel(seatCode);
        if (rowLabel.isEmpty()) {
            return false;
        }

        String vipRows = room.getVipRows();
        if (vipRows != null && !vipRows.trim().isEmpty()) {
            String normalizedVipRows = vipRows
                    .replace("[", "")
                    .replace("]", "")
                    .replace("\"", "")
                    .replace("'", "")
                    .replace(" ", "")
                    .toUpperCase(Locale.ROOT);
            int rowNumber = rowLabel.toUpperCase(Locale.ROOT).charAt(0) - 'A' + 1;
            for (String vipRow : normalizedVipRows.split(",")) {
                if (rowLabel.equalsIgnoreCase(vipRow) || isSameNumericRow(vipRow, rowNumber)) {
                    return true;
                }
            }
            return false;
        }

        int totalRows = room.getTotalRows() != null && room.getTotalRows() > 0
                ? room.getTotalRows()
                : DEFAULT_TOTAL_ROWS;
        int rowIndex = rowLabel.toUpperCase(Locale.ROOT).charAt(0) - 'A';
        return rowIndex >= Math.max(0, totalRows - 2);
    }

    private String extractRowLabel(String seatCode) {
        if (seatCode == null) {
            return "";
        }
        return seatCode.replaceAll("\\d", "").trim();
    }

    private boolean isSameNumericRow(String vipRow, int rowNumber) {
        try {
            return Integer.parseInt(vipRow) == rowNumber;
        } catch (NumberFormatException ignored) {
            return false;
        }
    }

    private static class BookingExpiredException extends RuntimeException {
        private BookingExpiredException(String message) {
            super(message);
        }
    }
}
