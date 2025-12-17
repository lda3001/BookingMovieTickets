package com.galaxycinema.service;

import com.galaxycinema.entity.Room;
import com.galaxycinema.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getActiveRooms() {
        return roomRepository.findByIsActiveTrue();
    }

    public List<Room> getRoomsByCinema(Long cinemaId) {
        return roomRepository.findByCinemaId(cinemaId);
    }

    public List<Room> getActiveRoomsByCinema(Long cinemaId) {
        return roomRepository.findActiveRoomsByCinemaId(cinemaId);
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room getRoomByIdWithCinema(Long id) {
        return roomRepository.findByIdWithCinema(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Transactional
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        room.setName(roomDetails.getName());
        room.setCinema(roomDetails.getCinema());
        room.setTotalRows(roomDetails.getTotalRows());
        room.setSeatsPerRow(roomDetails.getSeatsPerRow());
        room.setVipRows(roomDetails.getVipRows());
        room.setIsActive(roomDetails.getIsActive());
        
        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setIsActive(false);
        roomRepository.save(room);
    }
}

