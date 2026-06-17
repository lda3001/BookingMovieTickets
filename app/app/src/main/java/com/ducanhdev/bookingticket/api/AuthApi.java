package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.AuthResponse;
import com.ducanhdev.bookingticket.model.LoginRequest;
import com.ducanhdev.bookingticket.model.RegisterRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface AuthApi {
    
    @POST("auth/login")
    Call<AuthResponse> login(@Body LoginRequest request);
    
    @POST("auth/register")
    Call<AuthResponse> register(@Body RegisterRequest request);
}
