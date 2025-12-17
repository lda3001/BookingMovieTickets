package com.galaxycinema.service;

import com.galaxycinema.entity.Showtime;
import com.galaxycinema.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowtimeService {
    private final ShowtimeRepository showtimeRepository;

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public List<Showtime> getShowtimesByMovieAndCinemaAndDate(Long movieId, Long cinemaId, LocalDate date) {
        return showtimeRepository.findByMovieAndCinemaAndDate(movieId, cinemaId, date);
    }

    public List<LocalDate> getAvailableDates(Long movieId, Long cinemaId) {
        return showtimeRepository.findAvailableDates(movieId, cinemaId);
    }

    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
    }

    @Transactional
    public Showtime createShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    @Transactional
    public Showtime updateShowtime(Long id, Showtime showtimeDetails) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        
        showtime.setShowTime(showtimeDetails.getShowTime());
        showtime.setEndTime(showtimeDetails.getEndTime());
        showtime.setFormat(showtimeDetails.getFormat());
        showtime.setPrice(showtimeDetails.getPrice());
        
        return showtimeRepository.save(showtime);
    }

    @Transactional
    public void deleteShowtime(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        showtime.setIsActive(false);
        showtimeRepository.save(showtime);
    }
}

