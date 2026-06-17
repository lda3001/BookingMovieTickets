package com.galaxycinema.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingExpirationScheduler {
    private static final Logger log = LoggerFactory.getLogger(BookingExpirationScheduler.class);

    private final BookingService bookingService;

    @Scheduled(
            fixedDelayString = "${booking.expiration-scan-ms:60000}",
            initialDelayString = "${booking.expiration-initial-delay-ms:10000}"
    )
    public void cancelExpiredUnpaidBookings() {
        int cancelledBookings = bookingService.cancelExpiredUnpaidBookings();
        if (cancelledBookings > 0) {
            log.info("Auto-cancelled {} expired unpaid booking(s)", cancelledBookings);
        }
    }
}
