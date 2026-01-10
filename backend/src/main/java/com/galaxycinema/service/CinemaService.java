package com.galaxycinema.service;

import com.galaxycinema.entity.Cinema;
import com.galaxycinema.repository.CinemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CinemaService {
    private final CinemaRepository cinemaRepository;
    private final RoomService roomService;

    public List<Cinema> getAllCinemas() {
        List<Cinema> cinemas = cinemaRepository.findAll();
        // tổng số phòng của rạp
        cinemas.forEach(cinema -> {
            cinema.setTotalRooms(roomService.getRoomsByCinema(cinema.getId()) != null ? roomService.getRoomsByCinema(cinema.getId()).size() : 0);
            cinemaRepository.save(cinema);
        });
        return cinemas;
    }

    public List<Cinema> getActiveCinemas() {
        return cinemaRepository.findByIsActiveTrue();
    }

    public List<Cinema> getCinemasByCity(String city) {
        return cinemaRepository.findByCity(city);
    }

    public Optional<Cinema> getCinemaById(Long id) {
        return cinemaRepository.findById(id);
    }

    @Transactional
    public Cinema createCinema(Cinema cinema) {
        return cinemaRepository.save(cinema);
    }

    @Transactional
    public Cinema updateCinema(Long id, Cinema cinemaDetails) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        
        cinema.setName(cinemaDetails.getName());
        cinema.setAddress(cinemaDetails.getAddress());
        cinema.setPhone(cinemaDetails.getPhone());
        cinema.setCity(cinemaDetails.getCity());
        cinema.setTotalRooms(cinemaDetails.getTotalRooms());
        cinema.setIsActive(cinemaDetails.getIsActive());
        
        return cinemaRepository.save(cinema);
    }

    @Transactional
    public void deleteCinema(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        cinema.setIsActive(false);
        cinemaRepository.save(cinema);
    }
}

