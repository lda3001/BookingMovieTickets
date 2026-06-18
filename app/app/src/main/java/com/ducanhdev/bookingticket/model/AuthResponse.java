package com.ducanhdev.bookingticket.model;

import com.google.gson.annotations.SerializedName;

public class AuthResponse {
    @SerializedName("token")
    private String token;
    
    @SerializedName("type")
    private String type;
    
    @SerializedName("userId")
    private int userId;
    
    @SerializedName("email")
    private String email;
    
    @SerializedName("fullName")
    private String fullName;
    
    @SerializedName("phone")
    private String phone;
    
    @SerializedName("dateOfBirth")
    private String dateOfBirth;
    
    @SerializedName("role")
    private String role;

    // Getters and Setters
   
}
