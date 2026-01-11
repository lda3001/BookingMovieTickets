package com.galaxycinema.service;

import com.galaxycinema.entity.Movie;
import com.galaxycinema.repository.MovieRepository;
import com.github.slugify.Slugify;
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
    private final Slugify slg = Slugify.builder().build();

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
        movie.setSlug(slg.slugify(movie.getTitle()));
        return movieRepository.save(movie);
    }

    @Transactional
    public Movie updateMovie(Long id, Movie movieDetails) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        // Update all fields
        if (movieDetails.getTitle() != null) {
            movie.setTitle(movieDetails.getTitle());
        }
        if (movieDetails.getSlug() != null) {
            movie.setSlug(movieDetails.getSlug());
        }
        if (movieDetails.getImage() != null) {
            movie.setImage(movieDetails.getImage());
        }
        if (movieDetails.getDuration() != null) {
            movie.setDuration(movieDetails.getDuration());
        }
        if (movieDetails.getRating() != null) {
            movie.setRating(movieDetails.getRating());
        }
        if (movieDetails.getReleaseDate() != null) {
            movie.setReleaseDate(movieDetails.getReleaseDate());
        }
        if (movieDetails.getCountry() != null) {
            movie.setCountry(movieDetails.getCountry());
        }
        if (movieDetails.getProducer() != null) {
            movie.setProducer(movieDetails.getProducer());
        }
        if (movieDetails.getGenre() != null) {
            movie.setGenre(movieDetails.getGenre());
        }
        if (movieDetails.getDirector() != null) {
            movie.setDirector(movieDetails.getDirector());
        }
        if (movieDetails.getCast() != null) {
            movie.setCast(movieDetails.getCast());
        }
        if (movieDetails.getTagline() != null) {
            movie.setTagline(movieDetails.getTagline());
        }
        if (movieDetails.getSubtitle() != null) {
            movie.setSubtitle(movieDetails.getSubtitle());
        }
        if (movieDetails.getContent() != null) {
            movie.setContent(movieDetails.getContent());
        }
        if (movieDetails.getDescription() != null) {
            movie.setDescription(movieDetails.getDescription());
        }
        if (movieDetails.getTrailerUrl() != null) {
            movie.setTrailerUrl(movieDetails.getTrailerUrl());
        }
        if (movieDetails.getIsActive() != null) {
            movie.setIsActive(movieDetails.getIsActive());
        }
        
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

