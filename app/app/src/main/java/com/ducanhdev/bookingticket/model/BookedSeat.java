package com.ducanhdev.bookingticket.model;

import com.google.gson.annotations.SerializedName;

public class BookedSeat {
    @SerializedName("id")
    private int id;
    
    @SerializedName("seatCode")
    private String seatCode;
    
    @SerializedName("createdAt")
    private String createdAt;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
