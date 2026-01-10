package com.galaxycinema.controller;

import com.galaxycinema.dto.request.RoomRequest;
import com.galaxycinema.dto.response.RoomResponse;
import com.galaxycinema.entity.Room;
import com.galaxycinema.entity.Cinema;
import com.galaxycinema.repository.CinemaRepository;
import com.galaxycinema.service.RoomService;
import com.galaxycinema.util.Mappers;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "API quản lý phòng chiếu phim")
public class RoomController {
    private final RoomService roomService;
    private final Mappers mappers;
    private final CinemaRepository cinemaRepository;

    @GetMapping
    @Operation(summary = "Lấy tất cả phòng", description = "Trả về danh sách tất cả các phòng chiếu phim")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(mappers.toRoomResponseList(roomService.getAllRooms()));
    }

//    @GetMapping()
//    @Operation(summary = "Tìm kiếm phòng", description = "Trả về danh sách các phòng theo tên hoặc rạp")
//    public ResponseEntity<List<RoomResponse>> searchRooms(@RequestParam String name) {
//        return ResponseEntity.ok(mappers.toRoomResponseList(roomService.searchRooms(name)));
//    }

    @GetMapping("/active")
    @Operation(summary = "Lấy phòng đang hoạt động", description = "Trả về danh sách các phòng đang hoạt động")
    public ResponseEntity<List<RoomResponse>> getActiveRooms() {
        return ResponseEntity.ok(mappers.toRoomResponseList(roomService.getActiveRooms()));
    }

    @GetMapping("/cinema/{cinemaId}")
    @Operation(summary = "Lấy phòng theo rạp", description = "Trả về danh sách các phòng của một rạp")
    public ResponseEntity<List<RoomResponse>> getRoomsByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(mappers.toRoomResponseList(roomService.getRoomsByCinema(cinemaId)));
    }

    @GetMapping("/cinema/{cinemaId}/active")
    @Operation(summary = "Lấy phòng đang hoạt động theo rạp", description = "Trả về danh sách các phòng đang hoạt động của một rạp")
    public ResponseEntity<List<RoomResponse>> getActiveRoomsByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(mappers.toRoomResponseList(roomService.getActiveRoomsByCinema(cinemaId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy phòng theo ID", description = "Trả về thông tin chi tiết của một phòng")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(mappers::toRoomResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/with-cinema")
    @Operation(summary = "Lấy phòng theo ID kèm thông tin rạp", description = "Trả về thông tin chi tiết của một phòng kèm thông tin rạp")
    public ResponseEntity<RoomResponse> getRoomByIdWithCinema(@PathVariable Long id) {
        return ResponseEntity.ok(mappers.toRoomResponse(roomService.getRoomByIdWithCinema(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo phòng mới", description = "Tạo một phòng chiếu phim mới trong hệ thống")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        Cinema cinema = cinemaRepository.findById(request.cinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        
        Room room = Room.builder()
                .name(request.name())
                .cinema(cinema)
                .totalRows(request.totalRows())
                .seatsPerRow(request.seatsPerRow())
                .vipRows(request.vipRows())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();
        
        Room savedRoom = roomService.createRoom(room);
        return ResponseEntity.ok(mappers.toRoomResponse(savedRoom));
    }

    

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật phòng", description = "Cập nhật thông tin của một phòng chiếu phim")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        Room room = roomService.getRoomById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        if (request.cinemaId() != null) {
            Cinema cinema = cinemaRepository.findById(request.cinemaId())
                    .orElseThrow(() -> new RuntimeException("Cinema not found"));
            room.setCinema(cinema);
        }
        
        room.setName(request.name());
        room.setTotalRows(request.totalRows());
        room.setSeatsPerRow(request.seatsPerRow());
        room.setVipRows(request.vipRows());
        if (request.isActive() != null) {
            room.setIsActive(request.isActive());
        }
        
        Room updatedRoom = roomService.updateRoom(id, room);
        return ResponseEntity.ok(mappers.toRoomResponse(updatedRoom));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phòng", description = "Xóa (vô hiệu hóa) một phòng chiếu phim khỏi hệ thống")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
