package com.ducanhdev.bookingticket.model;

import com.google.gson.annotations.SerializedName;

public class Room {
    @SerializedName("id")
    private int id;
    
    @SerializedName("name")
    private String name;
    
    @SerializedName("cinemaId")
    private int cinemaId;
    
    @SerializedName("cinemaName")
    private String cinemaName;
    
    @SerializedName("totalRows")
    private int totalRows;
    
    @SerializedName("seatsPerRow")
    private int seatsPerRow;
    
    @SerializedName("vipRows")
    private String vipRows;
    
    @SerializedName("isActive")
    private boolean isActive;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCinemaId() { return cinemaId; }
    public void setCinemaId(int cinemaId) { this.cinemaId = cinemaId; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }

    public int getSeatsPerRow() { return seatsPerRow; }
    public void setSeatsPerRow(int seatsPerRow) { this.seatsPerRow = seatsPerRow; }

    public String getVipRows() { return vipRows; }
    public void setVipRows(String vipRows) { this.vipRows = vipRows; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
