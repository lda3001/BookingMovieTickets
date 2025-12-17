package com.galaxycinema.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String image;

    @Column(length = 10)
    private String duration;

    @Column(length = 10)
    private String rating;

    @Column(name = "release_date")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate releaseDate;

    @Column(length = 100)
    private String country;

    @Column(name = "producer", length = 500)
    private String producer;

    @Column(name = "genre", length = 200)
    private String genre;

    @Column(length = 100)
    private String director;

    @Column(name = "cast", length = 500)
    private String cast;

    @Column(name = "tagline", length = 500)
    private String tagline;

    @Column(name = "subtitle", length = 200)
    private String subtitle;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Showtime> showtimes = new ArrayList<>();

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}

