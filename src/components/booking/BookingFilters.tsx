"use client";

import React, { useState, useMemo, useEffect } from 'react';
import styles from './BookingFilters.module.css';
import SeatSelector from './SeatSelector';
import { useCinemas, useCinemasByCity } from '@/hooks/useCinemas';
import { useShowtimesByMovie, useShowtimesByMovieAndCinemaAndDate, useAvailableDates } from '@/hooks/useShowtimes';
import { Showtime } from '@/types/api';
import dayjs from '@/lib/dayjs';

interface BookingFiltersProps {
    movieId: number;
    movieTitle?: string;
}

export default function BookingFilters({ movieId, movieTitle = "Phim" }: BookingFiltersProps) {
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | undefined>();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

    // Fetch cinemas
    const { cinemas: allCinemas } = useCinemas();
    const { cinemas: cityCinemas } = useCinemasByCity(selectedCity || undefined);

    // Get unique cities from cinemas
    const cities = Array.from(new Set(allCinemas.map(c => c.city).filter(Boolean))) as string[];

    // Fetch available dates when cinema is selected
    const { dates: availableDates } = useAvailableDates(movieId, selectedCinemaId);

    // `selectedDate` is already stored as YYYY-MM-DD
    const formattedDate = selectedDate || undefined;

    // Fetch all showtimes when no filters are selected
    const { showtimes: allShowtimes, loading: allShowtimesLoading } = useShowtimesByMovie(
        (!selectedCinemaId || !selectedDate) ? movieId : undefined
    );

    // Fetch filtered showtimes when all filters are selected
    const { showtimes: filteredShowtimes, loading: filteredShowtimesLoading } = useShowtimesByMovieAndCinemaAndDate(
        selectedCinemaId && selectedDate ? movieId : undefined,
        selectedCinemaId,
        formattedDate
    );

    // Filter all showtimes by date if date is selected but cinema is not
    const filteredByDateShowtimes = useMemo(() => {
        if (!selectedDate || selectedCinemaId) {
            return allShowtimes;
        }
        
        return allShowtimes.filter(showtime => {
            if (!showtime.showTime) return false;
            const showtimeDate = dayjs(showtime.showTime, 'DD/MM/YYYY HH:mm', true);
            if (!showtimeDate.isValid()) return false;
            const selectedDateObj = dayjs(selectedDate, 'YYYY-MM-DD', true);
            return showtimeDate.isSame(selectedDateObj, 'day');
        });
    }, [allShowtimes, selectedDate, selectedCinemaId]);

    // Use filtered showtimes if filters are selected, otherwise use all showtimes or date-filtered showtimes
    const showtimes = (selectedCinemaId && selectedDate) 
        ? filteredShowtimes 
        : (selectedDate && !selectedCinemaId) 
            ? filteredByDateShowtimes 
            : allShowtimes;
    const showtimesLoading = (selectedCinemaId && selectedDate) 
        ? filteredShowtimesLoading 
        : allShowtimesLoading;

    // Extract unique dates from all showtimes
    const getAllAvailableDates = useMemo(() => {
        if (!allShowtimes || allShowtimes.length === 0) {
            return [];
        }

        const dateSet = new Set<string>();
        allShowtimes.forEach(showtime => {
            if (showtime.showTime) {
                const showtimeDate = dayjs(showtime.showTime, 'DD/MM/YYYY HH:mm', true);
                if (showtimeDate.isValid()) {
                    dateSet.add(showtimeDate.format('YYYY-MM-DD'));
                }
            }
        });

        return Array.from(dateSet).sort();
    }, [allShowtimes]);

    // Format dates for display
    const formatAllDates = () => {
        if (getAllAvailableDates.length === 0) {
            return [];
        }

        const today = dayjs();
        const dates = getAllAvailableDates.map((dateStr) => {
            const date = dayjs(dateStr, 'YYYY-MM-DD', true);
            
            const isToday = date.isSame(today, 'day');
            const dayName = isToday ? 'Hôm nay' : date.format('dddd');
            const dayNum = date.format('DD/MM');
            const value = dateStr;
            
            return {
                day: dayName,
                date: dayNum,
                value: value,
            };
        });

        return dates;
    };

    // Group showtimes by cinema and format
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const cinemaName = showtime.cinemaName || 'Unknown';
        const format = showtime.format || 'Standard';
        
        if (!acc[cinemaName]) {
            acc[cinemaName] = {};
        }
        if (!acc[cinemaName][format]) {
            acc[cinemaName][format] = [];
        }
        
        acc[cinemaName][format].push(showtime);
        return acc;
    }, {} as Record<string, Record<string, Showtime[]>>);

    // Format dates for display
    const formatDates = () => {
        if (!availableDates || availableDates.length === 0) {
            return [];
        }

        const today = dayjs();
        const dates = availableDates.map((dateStr) => {
            // Backend typically returns LocalDate as `YYYY-MM-DD`
            // but keep a fallback for `DD/MM/YYYY`.
            const date = dayjs(dateStr, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
            
            const isToday = date.isSame(today, 'day');
            const dayName = isToday ? 'Hôm nay' : date.format('dddd');
            const dayNum = date.format('DD/MM');
            const value = date.format('YYYY-MM-DD'); // Format for API
            
            return {
                day: dayName,
                date: dayNum,
                value: value,
            };
        });

        return dates;
    };

    const dateOptions = formatDates();

    // Auto-select first date when dates are available and no date is selected
    useEffect(() => {
        if (!selectedDate && !showtimesLoading) {
            if (selectedCinemaId && dateOptions.length > 0) {
                // When cinema is selected, use dates from API
                setSelectedDate(dateOptions[0].value);
            } else if (!selectedCinemaId && getAllAvailableDates.length > 0) {
                // When no cinema is selected, use dates from all showtimes
                setSelectedDate(getAllAvailableDates[0]);
            }
        }
    }, [selectedCinemaId, dateOptions, getAllAvailableDates, selectedDate, showtimesLoading]);

    const handleShowtimeSelect = (showtime: Showtime) => {
        setSelectedShowtime(showtime);
    };

    const handleCloseSeatSelector = () => {
        setSelectedShowtime(null);
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.navLine}>
                <div className={`${styles.navItem} ${styles.active}`}>Lịch chiếu</div>
                <div className={styles.navItem}>Thông tin chi tiết</div>
            </div>

            <div className={styles.selectors}>
                <div className={styles.selectGroup}>
                    <select 
                        className={styles.select}
                        value={selectedCity}
                        onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setSelectedCinemaId(undefined);
                            setSelectedDate('');
                        }}
                    >
                        <option value="">Tất cả thành phố</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.selectGroup}>
                    <select 
                        className={styles.select}
                        value={selectedCinemaId || ''}
                        onChange={(e) => {
                            setSelectedCinemaId(e.target.value ? Number(e.target.value) : undefined);
                            setSelectedDate('');
                        }}
                    >
                        <option value="">Tất cả rạp</option>
                        {(selectedCity ? cityCinemas : allCinemas).map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedCinemaId && dateOptions.length > 0 && (
                <div className={styles.dateBar}>
                    {dateOptions.map((d, idx) => (
                        <div
                            key={idx}
                            className={`${styles.dateItem} ${selectedDate === d.value ? styles.active : ''}`}
                            onClick={() => setSelectedDate(d.value)}
                        >
                            <div className={styles.dayName}>{d.day}</div>
                            <div className={styles.dayNum}>{d.date}</div>
                        </div>
                    ))}
                </div>
            )}

            {!selectedCinemaId && formatAllDates().length > 0 && (
                <div className={styles.dateBar}>
                    {formatAllDates().map((d, idx) => (
                        <div
                            key={idx}
                            className={`${styles.dateItem} ${selectedDate === d.value ? styles.active : ''}`}
                            onClick={() => setSelectedDate(d.value)}
                        >
                            <div className={styles.dayName}>{d.day}</div>
                            <div className={styles.dayNum}>{d.date}</div>
                        </div>
                    ))}
                </div>
            )}

            {showtimesLoading && (
                <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải lịch chiếu...</div>
            )}

            {!showtimesLoading && Object.keys(groupedShowtimes).length > 0 && (
                <div className={styles.cinemaList}>
                    {Object.entries(groupedShowtimes).map(([cinemaName, formats]) => (
                        <div key={cinemaName} className={styles.cinemaItem}>
                            <div className={styles.cinemaTitle}>{cinemaName}</div>
                            {Object.entries(formats).map(([format, showtimes]) => (
                                <div key={format} className={styles.formatRow}>
                                    <div className={styles.formatLabel}>{format}</div>
                                    <div className={styles.timeGrid}>
                                        {showtimes.map((showtime) => {
                                            const t = showtime.showTime
                                                ? dayjs(showtime.showTime, 'DD/MM/YYYY HH:mm', true)
                                                : null;
                                            const timeStr = t && t.isValid()
                                                ? t.format('HH:mm')
                                                : (showtime.showTime || '');
                                            return (
                                                <button
                                                    key={showtime.id}
                                                    className={styles.timeBtn}
                                                    onClick={() => handleShowtimeSelect(showtime)}
                                                >
                                                    {timeStr}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {!showtimesLoading && Object.keys(groupedShowtimes).length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    {selectedCinemaId && selectedDate 
                        ? 'Không có lịch chiếu cho ngày đã chọn'
                        : 'Không có lịch chiếu'}
                </div>
            )}

            {selectedShowtime && (
                <SeatSelector
                    movieTitle={movieTitle}
                    showtime={selectedShowtime}
                    onClose={handleCloseSeatSelector}
                />
            )}
        </div>
    );
}
