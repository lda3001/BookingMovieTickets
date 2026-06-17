package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.Showtime;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ShowtimeApi {

    @GET("showtimes/{id}")
    Call<Showtime> getShowtimeById(@Path("id") int id);

    @GET("showtimes/movie/{movieId}")
    Call<List<Showtime>> getShowtimesByMovie(@Path("movieId") int movieId);

    @GET("showtimes/movie/{movieId}/cinema/{cinemaId}/date/{date}")
    Call<List<Showtime>> getShowtimesByMovieCinemaDate(
            @Path("movieId") int movieId,
            @Path("cinemaId") int cinemaId,
            @Path("date") String date
    );

    @GET("showtimes/{id}/booked-seats")
    Call<List<String>> getBookedSeats(@Path("id") int id);
}
