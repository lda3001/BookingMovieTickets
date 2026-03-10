package com.ducanhdev.bookingticket.utils;

public class Constants {
    
    // API Base URL - Change for production
    public static final String BASE_URL = "http://10.0.2.2:8080/api/";
    
    // Intent extras keys
    public static final String EXTRA_MOVIE_ID = "movie_id";
    public static final String EXTRA_MOVIE_SLUG = "movie_slug";
    public static final String EXTRA_SHOWTIME_ID = "showtime_id";
    public static final String EXTRA_BOOKING_ID = "booking_id";
    public static final String EXTRA_BOOKING_CODE = "booking_code";
    
    // Date formats
    public static final String DATE_FORMAT_API = "dd/MM/yyyy";
    public static final String DATE_FORMAT_DISPLAY = "dd/MM/yyyy";
    public static final String DATETIME_FORMAT_API = "dd/MM/yyyy HH:mm";
    public static final String TIME_FORMAT_DISPLAY = "HH:mm";
    
    // Seat types
    public static final String SEAT_TYPE_NORMAL = "NORMAL";
    public static final String SEAT_TYPE_VIP = "VIP";
    public static final String SEAT_TYPE_BOOKED = "BOOKED";
    public static final String SEAT_TYPE_SELECTED = "SELECTED";
    
    // Booking status
    public static final String BOOKING_STATUS_PENDING = "PENDING";
    public static final String BOOKING_STATUS_CONFIRMED = "CONFIRMED";
    public static final String BOOKING_STATUS_CANCELLED = "CANCELLED";
    public static final String BOOKING_STATUS_COMPLETED = "COMPLETED";
    
    // Age ratings
    public static final String AGE_RATING_P = "P";
    public static final String AGE_RATING_K = "K";
    public static final String AGE_RATING_T13 = "T13";
    public static final String AGE_RATING_T16 = "T16";
    public static final String AGE_RATING_T18 = "T18";
    
    // Prices (in VND)
    public static final int PRICE_NORMAL = 75000;
    public static final int PRICE_VIP = 90000;
}
