package com.galaxycinema.service;

import com.galaxycinema.entity.Movie;
import com.galaxycinema.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> getActiveMovies() {
        return movieRepository.findByIsActiveTrue();
    }

    public List<Movie> getNowShowingMovies() {
        return movieRepository.findNowShowing();
    }

    public List<Movie> getComingSoonMovies() {
        return movieRepository.findComingSoon();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Optional<Movie> getMovieBySlug(String slug) {
        return movieRepository.findBySlug(slug);
    }

    @Transactional
    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    @Transactional
    public Movie updateMovie(Long id, Movie movieDetails) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setTitle(movieDetails.getTitle());
        movie.setSlug(movieDetails.getSlug());
        movie.setImage(movieDetails.getImage());
        movie.setDuration(movieDetails.getDuration());
        movie.setRating(movieDetails.getRating());
        movie.setReleaseDate(movieDetails.getReleaseDate());
        movie.setCountry(movieDetails.getCountry());
        movie.setProducer(movieDetails.getProducer());
        movie.setGenre(movieDetails.getGenre());
        movie.setDirector(movieDetails.getDirector());
        movie.setCast(movieDetails.getCast());
        movie.setContent(movieDetails.getContent());
        movie.setDescription(movieDetails.getDescription());
        movie.setTrailerUrl(movieDetails.getTrailerUrl());
        
        return movieRepository.save(movie);
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setIsActive(false);
        movieRepository.save(movie);
    }

    public List<Movie> getMoviesByReleaseDateRange(LocalDate startDate, LocalDate endDate) {
        return movieRepository.findByReleaseDateBetween(startDate, endDate);
    }

    public List<Movie> getMoviesByReleaseYear(int year) {
        return movieRepository.findByReleaseYear(year);
    }
}

