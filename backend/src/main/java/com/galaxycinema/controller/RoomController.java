package com.galaxycinema.controller;

import com.galaxycinema.entity.Room;
import com.galaxycinema.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @GetMapping
    @Operation(summary = "Lấy tất cả phòng", description = "Trả về danh sách tất cả các phòng chiếu phim")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy phòng đang hoạt động", description = "Trả về danh sách các phòng đang hoạt động")
    public ResponseEntity<List<Room>> getActiveRooms() {
        return ResponseEntity.ok(roomService.getActiveRooms());
    }

    @GetMapping("/cinema/{cinemaId}")
    @Operation(summary = "Lấy phòng theo rạp", description = "Trả về danh sách các phòng của một rạp")
    public ResponseEntity<List<Room>> getRoomsByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(roomService.getRoomsByCinema(cinemaId));
    }

    @GetMapping("/cinema/{cinemaId}/active")
    @Operation(summary = "Lấy phòng đang hoạt động theo rạp", description = "Trả về danh sách các phòng đang hoạt động của một rạp")
    public ResponseEntity<List<Room>> getActiveRoomsByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(roomService.getActiveRoomsByCinema(cinemaId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy phòng theo ID", description = "Trả về thông tin chi tiết của một phòng")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/with-cinema")
    @Operation(summary = "Lấy phòng theo ID kèm thông tin rạp", description = "Trả về thông tin chi tiết của một phòng kèm thông tin rạp")
    public ResponseEntity<Room> getRoomByIdWithCinema(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomByIdWithCinema(id));
    }

    @PostMapping
    @Operation(summary = "Tạo phòng mới", description = "Tạo một phòng chiếu phim mới trong hệ thống")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật phòng", description = "Cập nhật thông tin của một phòng chiếu phim")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.updateRoom(id, room));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phòng", description = "Xóa (vô hiệu hóa) một phòng chiếu phim khỏi hệ thống")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}

