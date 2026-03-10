package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.Booking;
import com.ducanhdev.bookingticket.model.CreateBookingRequest;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface BookingApi {
    
    @POST("bookings")
    Call<Booking> createBooking(@Body CreateBookingRequest request);
    
    @GET("bookings/user")
    Call<List<Booking>> getUserBookings();
    
    @GET("bookings/{id}")
    Call<Booking> getBookingById(@Path("id") int id);
    
    @GET("bookings/code/{code}")
    Call<Booking> getBookingByCode(@Path("code") String code);
}
