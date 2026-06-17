package com.ducanhdev.bookingticket.model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Showtime {
    @SerializedName("id")
    private int id;
    
    @SerializedName("movieId")
    private int movieId;
    
    @SerializedName("movieTitle")
    private String movieTitle;
    
    @SerializedName("movieSlug")
    private String movieSlug;
    
    @SerializedName("cinemaId")
    private int cinemaId;
    
    @SerializedName("cinemaName")
    private String cinemaName;
    
    @SerializedName("roomId")
    private int roomId;
    
    @SerializedName("roomName")
    private String roomName;
    
    @SerializedName("movie")
    private Movie movie;
    
    @SerializedName("cinema")
    private Cinema cinema;
    
    @SerializedName("room")
    private Room room;
    
    @SerializedName("showTime")
    private String showTime;
    
    @SerializedName("endTime")
    private String endTime;
    
    @SerializedName("format")
    private String format;
    
    @SerializedName("price")
    private double price;
    
    @SerializedName("isActive")
    private boolean isActive;
    
    @SerializedName("bookedSeats")
    private List<BookedSeat> bookedSeats;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getMovieId() { return movieId; }
    public void setMovieId(int movieId) { this.movieId = movieId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getMovieSlug() { return movieSlug; }
    public void setMovieSlug(String movieSlug) { this.movieSlug = movieSlug; }

    public int getCinemaId() { return cinemaId; }
    public void setCinemaId(int cinemaId) { this.cinemaId = cinemaId; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public Cinema getCinema() { return cinema; }
    public void setCinema(Cinema cinema) { this.cinema = cinema; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public String getShowTime() { return showTime; }
    public void setShowTime(String showTime) { this.showTime = showTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public List<BookedSeat> getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(List<BookedSeat> bookedSeats) { this.bookedSeats = bookedSeats; }
}
