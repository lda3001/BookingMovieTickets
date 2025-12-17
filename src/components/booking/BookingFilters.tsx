"use client";

import React, { useState } from 'react';
import styles from './BookingFilters.module.css';
import SeatSelector from './SeatSelector';

// Mock Data
const DATES = [
    { day: 'Hôm nay', date: '01/01' },
    { day: 'Thứ Hai', date: '02/01' },
    { day: 'Thứ Ba', date: '03/01' },
    { day: 'Thứ Tư', date: '04/01' },
    { day: 'Thứ Năm', date: '05/01' },
];

const SHOWTIMES_MOCK = [
    {
        cinema: "Galaxy Nguyễn Du",
        formats: [
            { type: "2D Phụ Đề", times: ["18:00", "20:30", "22:00"] },
            { type: "2D Lồng Tiếng", times: ["19:15"] }
        ]
    },
    {
        cinema: "Galaxy Tân Bình",
        formats: [
            { type: "2D Phụ Đề", times: ["17:45", "19:00", "21:15"] }
        ]
    }
];

interface BookingFiltersProps {
    movieTitle?: string;
}

export default function BookingFilters({ movieTitle = "Phim" }: BookingFiltersProps) {
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedShow, setSelectedShow] = useState<{ cinema: string, time: string } | null>(null);

    return (
        <div className={styles.filterContainer}>
            <div className={styles.navLine}>
                <div className={`${styles.navItem} ${styles.active}`}>Lịch chiếu</div>
                <div className={styles.navItem}>Thông tin chi tiết</div>
            </div>

            <div className={styles.selectors}>
                <div className={styles.selectGroup}>
                    <select className={styles.select}>
                        <option>TP Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                    </select>
                </div>
                <div className={styles.selectGroup}>
                    <select className={styles.select}>
                        <option>Tất cả rạp</option>
                        <option>Galaxy Nguyễn Du</option>
                    </select>
                </div>
                <div className={styles.selectGroup}>
                    <select className={styles.select}>
                        <option>Tất cả suất</option>
                    </select>
                </div>
            </div>

            <div className={styles.dateBar}>
                {DATES.map((d, idx) => (
                    <div
                        key={idx}
                        className={`${styles.dateItem} ${selectedDate === idx ? styles.active : ''}`}
                        onClick={() => setSelectedDate(idx)}
                    >
                        <div className={styles.dayName}>{d.day}</div>
                        <div className={styles.dayNum}>{d.date}</div>
                    </div>
                ))}
            </div>

            <div className={styles.cinemaList}>
                {SHOWTIMES_MOCK.map((cinema, cIdx) => (
                    <div key={cIdx} className={styles.cinemaItem}>
                        <div className={styles.cinemaTitle}>{cinema.cinema}</div>
                        {cinema.formats.map((fmt, fIdx) => (
                            <div key={fIdx} className={styles.formatRow}>
                                <div className={styles.formatLabel}>{fmt.type}</div>
                                <div className={styles.timeGrid}>
                                    {fmt.times.map((time, tIdx) => (
                                        <button
                                            key={tIdx}
                                            className={styles.timeBtn}
                                            onClick={() => setSelectedShow({ cinema: cinema.cinema, time })}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {selectedShow && (
                <SeatSelector
                    movieTitle={movieTitle}
                    cinema={selectedShow.cinema}
                    showtime={selectedShow.time}
                    onClose={() => setSelectedShow(null)}
                />
            )}
        </div>
    );
}
