package com.ducanhdev.bookingticket.utils;

import android.net.Uri;

import com.ducanhdev.bookingticket.model.Booking;

public final class TicketQrUtils {
    private static final String PAID_PAYMENT_STATUS = "PAID";

    private TicketQrUtils() {
    }

    public static boolean isPaidBooking(Booking booking) {
        if (booking == null || Constants.BOOKING_STATUS_CANCELLED.equals(booking.getStatus())) {
            return false;
        }

        return PAID_PAYMENT_STATUS.equalsIgnoreCase(booking.getPaymentStatus())
                || Constants.BOOKING_STATUS_CONFIRMED.equals(booking.getStatus())
                || Constants.BOOKING_STATUS_COMPLETED.equals(booking.getStatus());
    }

    public static String buildTicketQrUrl(Booking booking) {
        return Uri.parse("https://api.qrserver.com/v1/create-qr-code/")
                .buildUpon()
                .appendQueryParameter("size", "360x360")
                .appendQueryParameter("margin", "12")
                .appendQueryParameter("data", buildTicketPayload(booking))
                .build()
                .toString();
    }

    private static String buildTicketPayload(Booking booking) {
        return "CINELUX_TICKET"
                + "\nMa ve: " + valueOrDash(booking.getBookingCode())
                + "\nPhim: " + valueOrDash(booking.getMovieTitle())
                + "\nSuat chieu: " + valueOrDash(booking.getShowTime())
                + "\nRap: " + joinNonEmpty(booking.getCinemaName(), booking.getRoomName())
                + "\nGhe: " + valueOrDash(booking.getSeatsString());
    }

    private static String joinNonEmpty(String first, String second) {
        String a = first == null ? "" : first.trim();
        String b = second == null ? "" : second.trim();
        if (!a.isEmpty() && !b.isEmpty()) return a + " - " + b;
        if (!a.isEmpty()) return a;
        if (!b.isEmpty()) return b;
        return "-";
    }

    private static String valueOrDash(String value) {
        return value == null || value.trim().isEmpty() ? "-" : value;
    }
}
