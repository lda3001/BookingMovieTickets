package com.ducanhdev.bookingticket.model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Booking {
    @SerializedName("id")
    private int id;
    
    @SerializedName("bookingCode")
    private String bookingCode;
    
    @SerializedName("userId")
    private int userId;
    
    @SerializedName("userEmail")
    private String userEmail;
    
    @SerializedName("userFullName")
    private String userFullName;
    
    @SerializedName("showtimeId")
    private int showtimeId;
    
    @SerializedName("showTime")
    private String showTime;
    
    @SerializedName("movieTitle")
    private String movieTitle;
    
    @SerializedName("cinemaName")
    private String cinemaName;
    
    @SerializedName("roomName")
    private String roomName;
    
    @SerializedName("seatCodes")
    private List<String> seatCodes;
    
    @SerializedName("showtime")
    private Showtime showtime;
    
    @SerializedName("totalPrice")
    private double totalPrice;
    
    @SerializedName("status")
    private String status;
    
    @SerializedName("paymentMethod")
    private String paymentMethod;
    
    @SerializedName("paymentStatus")
    private String paymentStatus;
    
    @SerializedName("createdAt")
    private String createdAt;
    
    @SerializedName("updatedAt")
    private String updatedAt;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public int getShowtimeId() { return showtimeId; }
    public void setShowtimeId(int showtimeId) { this.showtimeId = showtimeId; }

    public String getShowTime() { return showTime; }
    public void setShowTime(String showTime) { this.showTime = showTime; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public List<String> getSeatCodes() { return seatCodes; }
    public void setSeatCodes(List<String> seatCodes) { this.seatCodes = seatCodes; }

    public Showtime getShowtime() { return showtime; }
    public void setShowtime(Showtime showtime) { this.showtime = showtime; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper method to get seats as comma-separated string
    public String getSeatsString() {
        if (seatCodes == null || seatCodes.isEmpty()) return "";
        return String.join(", ", seatCodes);
    }
}
