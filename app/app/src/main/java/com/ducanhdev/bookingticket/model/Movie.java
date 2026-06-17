package com.ducanhdev.bookingticket.model;

import android.util.Log;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Movie {
    @SerializedName("id")
    private int id;
    
    @SerializedName("slug")
    private String slug;
    
    @SerializedName("title")
    private String title;
    
    @SerializedName("image")
    private String image;
    
    @SerializedName("duration")
    private String duration;
    
    @SerializedName("rating")
    private String rating;
    
    @SerializedName("ageRating")
    private String ageRating;
    
    @SerializedName("releaseDate")
    private String releaseDate;
    
    @SerializedName("country")
    private String country;
    
    @SerializedName("producer")
    private String producer;
    
    @SerializedName("genre")
    private String genre;
    
    @SerializedName("director")
    private String director;
    
    @SerializedName("cast")
    private String cast;
    
    @SerializedName("tagline")
    private String tagline;
    
    @SerializedName("subtitle")
    private String subtitle;
    
    @SerializedName("trailerUrl")
    private String trailerUrl;
    
    @SerializedName("content")
    private String content;
    
    @SerializedName("description")
    private String description;
    
    @SerializedName("isActive")
    private boolean isActive;
    
    @SerializedName("showtimes")
    private List<Showtime> showtimes;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getAgeRating() { return ageRating; }
    public void setAgeRating(String ageRating) { this.ageRating = ageRating; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getProducer() { return producer; }
    public void setProducer(String producer) { this.producer = producer; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getCast() { return cast; }
    public void setCast(String cast) { this.cast = cast; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public List<Showtime> getShowtimes() { return showtimes; }
    public void setShowtimes(List<Showtime> showtimes) { this.showtimes = showtimes; }
    
    // Helper method to get full image URL
    public String getFullImageUrl() {
        if (image == null || image.isEmpty()) {
            Log.w("Movie", "Image is null or empty for movie: " + title);
            return null;
        }
        
        Log.d("Movie", "Original image value for '" + title + "': " + image);
        
        // Already a full URL
        if (image.startsWith("http://") || image.startsWith("https://")) {
            Log.d("Movie", "Using full URL: " + image);
            return image;
        }
        
        // Relative path - prepend base URL
        String baseUrl = "http://10.0.2.2:8080";
        String fullUrl;
        
        if (image.startsWith("/")) {
            fullUrl = baseUrl + image;
        } else {
            fullUrl = baseUrl + "/" + image;
        }
        
        Log.d("Movie", "Constructed full URL: " + fullUrl);
        return fullUrl;
    }
}
