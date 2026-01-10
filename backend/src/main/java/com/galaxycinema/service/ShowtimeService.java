package com.galaxycinema.service;

import com.galaxycinema.entity.Showtime;
import com.galaxycinema.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeService {
    private final ShowtimeRepository showtimeRepository;

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public List<Showtime> getShowtimesByMovieAndCinemaAndDate(Long movieId, Long cinemaId, LocalDate date) {
        // convert date to LocalDateTime
        return showtimeRepository.findByMovieAndCinemaAndDate(movieId, cinemaId, date);
    }

    public List<LocalDate> getAvailableDates(Long movieId, Long cinemaId) {
        List<Showtime> showtimes = showtimeRepository.findAvailableDates(movieId, cinemaId);
        return showtimes.stream()
                .map(s -> s.getShowTime().toLocalDate())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
    }

    @Transactional
    public Showtime createShowtime(Showtime showtime) {
        // check if showtime already exists in the same room
        List<Showtime> existingShowtimes = showtimeRepository.findByRoomAndDate(showtime.getRoom().getId(), showtime.getShowTime().toLocalDate());
        if (existingShowtimes.size() > 0) {
            throw new RuntimeException("Showtime already exists in the same room");
        }

        
        

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

