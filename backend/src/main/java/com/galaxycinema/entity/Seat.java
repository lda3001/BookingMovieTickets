package com.galaxycinema.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnoreProperties(value = {"seats", "showtimes", "hibernateLazyInitializer", "handler"}, allowSetters = true)
    private Room room;

    @Column(name = "row_label", length = 5)
    private String rowLabel; // A, B, C, etc.

    @Column(name = "seat_number")
    private Integer seatNumber;

    @Column(name = "seat_code", length = 10)
    private String seatCode; // A1, A2, B1, etc.

    @Column(name = "is_vip")
    private Boolean isVip = false;

    @Column(name = "price")
    private Double price;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        if (seatCode == null && rowLabel != null && seatNumber != null) {
            seatCode = rowLabel + seatNumber;
        }
    }
}

