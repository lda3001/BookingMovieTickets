"use client";

import React from 'react';
import styles from './QuickBooking.module.css';
import { Movie } from '@/types/api';

export default function QuickBooking({ nowShowingMovies }: { nowShowingMovies: Movie[] }) {
    
   

    return (
        <div className={styles.bookingBar}>
            <div className={styles.field}>
                <span className={styles.label}>Chọn phim</span>
                <select className={styles.select} defaultValue="">
                    <option value="" disabled>Chọn phim</option>
                    {nowShowingMovies.map(movie => (
                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <span className={styles.label}>Chọn rạp</span>
                <select className={styles.select} defaultValue="">
                    <option value="" disabled>Chọn rạp</option>
                    <option value="1">Galaxy Nguyễn Du</option>
                    <option value="2">Galaxy Tân Bình</option>
                </select>
            </div>

            <div className={styles.field}>
                <span className={styles.label}>Chọn ngày</span>
                <select className={styles.select} defaultValue="">
                    <option value="" disabled>Chọn ngày</option>
                    <option value="today">Hôm nay</option>
                    <option value="tomorrow">Ngày mai</option>
                </select>
            </div>

            <div className={styles.field}>
                <span className={styles.label}>Chọn suất</span>
                <select className={styles.select} defaultValue="">
                    <option value="" disabled>Chọn suất</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                </select>
            </div>

            <button className={styles.buyBtn}>
                Mua vé nhanh
            </button>
        </div>
    );
}
