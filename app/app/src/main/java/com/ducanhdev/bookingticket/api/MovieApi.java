package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.Movie;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface MovieApi {
    
    @GET("movies")
    Call<List<Movie>> getAllMovies();
    
    @GET("movies/active")
    Call<List<Movie>> getActiveMovies();
    
    @GET("movies/now-showing")
    Call<List<Movie>> getNowShowingMovies();
    
    @GET("movies/coming-soon")
    Call<List<Movie>> getComingSoonMovies();
    
    @GET("movies/{id}")
    Call<Movie> getMovieById(@Path("id") int id);
    
    @GET("movies/slug/{slug}")
    Call<Movie> getMovieBySlug(@Path("slug") String slug);
}
