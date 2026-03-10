package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.Cinema;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface CinemaApi {
    
    @GET("cinemas")
    Call<List<Cinema>> getAllCinemas();
    
    @GET("cinemas/{id}")
    Call<Cinema> getCinemaById(@Path("id") int id);
    
    @GET("cinemas/city/{city}")
    Call<List<Cinema>> getCinemasByCity(@Path("city") String city);
}
