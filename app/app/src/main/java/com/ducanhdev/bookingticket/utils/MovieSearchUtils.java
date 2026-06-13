package com.ducanhdev.bookingticket.utils;

import com.ducanhdev.bookingticket.model.Movie;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public final class MovieSearchUtils {
    private MovieSearchUtils() {
    }

    public static List<Movie> filterMovies(List<Movie> movies, String query) {
        List<Movie> filteredMovies = new ArrayList<>();
        if (movies == null || movies.isEmpty()) {
            return filteredMovies;
        }

        String normalizedQuery = normalize(query);
        if (normalizedQuery.isEmpty()) {
            filteredMovies.addAll(movies);
            return filteredMovies;
        }

        for (Movie movie : movies) {
            if (matches(movie, normalizedQuery)) {
                filteredMovies.add(movie);
            }
        }
        return filteredMovies;
    }

    private static boolean matches(Movie movie, String normalizedQuery) {
        String searchableText = normalize(joinSearchParts(
                movie.getTitle(),
                movie.getSlug(),
                movie.getGenre(),
                movie.getDirector(),
                movie.getCast(),
                movie.getCountry(),
                movie.getProducer(),
                movie.getTagline(),
                movie.getSubtitle(),
                movie.getDescription(),
                movie.getContent(),
                movie.getDuration(),
                movie.getReleaseDate(),
                movie.getAgeRating(),
                movie.getRating()
        ));
        return searchableText.contains(normalizedQuery);
    }

    private static String joinSearchParts(String... parts) {
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (part != null && !part.trim().isEmpty()) {
                if (builder.length() > 0) {
                    builder.append(' ');
                }
                builder.append(part);
            }
        }
        return builder.toString();
    }

    private static String normalize(String value) {
        if (value == null) {
            return "";
        }
        String normalized = Normalizer.normalize(value.trim(), Normalizer.Form.NFD);
        return normalized
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replace('\u0111', 'd')
                .replace('\u0110', 'd')
                .toLowerCase(Locale.ROOT);
    }
}
