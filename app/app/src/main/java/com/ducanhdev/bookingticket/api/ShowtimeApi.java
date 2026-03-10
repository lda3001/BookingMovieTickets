package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.Showtime;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ShowtimeApi {
    
    @GET("showtimes")
    Call<List<Showtime>> getAllShowtimes();
    
    @GET("showtimes/{id}")
    Call<Showtime> getShowtimeById(@Path("id") int id);
    
    @GET("showtimes/movie/{movieId}")
    Call<List<Showtime>> getShowtimesByMovie(@Path("movieId") int movieId);
    
    @GET("showtimes/movie/slug/{slug}")
    Call<List<Showtime>> getShowtimesByMovieSlug(@Path("slug") String slug);
    
    @GET("showtimes/cinema/{cinemaId}")
    Call<List<Showtime>> getShowtimesByCinema(@Path("cinemaId") int cinemaId);
    
    @GET("showtimes/date")
    Call<List<Showtime>> getShowtimesByDate(@Query("date") String date);
}
