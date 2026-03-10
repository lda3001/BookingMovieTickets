package com.ducanhdev.bookingticket.model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class CreateBookingRequest {
    @SerializedName("showtimeId")
    private int showtimeId;
    
    @SerializedName("seatCodes")
    private List<String> seatCodes;

    public CreateBookingRequest(int showtimeId, List<String> seatCodes) {
        this.showtimeId = showtimeId;
        this.seatCodes = seatCodes;
    }

    public int getShowtimeId() { return showtimeId; }
    public void setShowtimeId(int showtimeId) { this.showtimeId = showtimeId; }

    public List<String> getSeatCodes() { return seatCodes; }
    public void setSeatCodes(List<String> seatCodes) { this.seatCodes = seatCodes; }
}
