"use client";

import React, { useState } from 'react';
import MovieCard from './MovieCard';
import styles from './MovieSection.module.css';
import { MOVIES } from '@/data/movies';
import { useComingSoonMovies, useNowShowingMovies } from '@/hooks/useMovies';
import { Movie } from '@/types/api';

export default function MovieSection({ nowShowingMovies, comingSoonMovies }: { nowShowingMovies: Movie[], comingSoonMovies: Movie[] }) {
    const [tab, setTab] = useState<'now' | 'coming'>('now');

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div
                    className={`${styles.tab} ${tab === 'now' ? styles.activeTab : ''}`}
                    onClick={() => setTab('now')}
                >
                    Đang chiếu
                </div>
                <div
                    className={`${styles.tab} ${tab === 'coming' ? styles.activeTab : ''}`}
                    onClick={() => setTab('coming')}
                >
                    Sắp chiếu
                </div>
            </div>

            <div className={styles.grid}>
                {(tab === 'now' ? nowShowingMovies : comingSoonMovies).map(movie => (
                    <MovieCard key={movie.id} title={movie.title} image={movie.image || ''} rating={movie.rating} duration={movie.duration} slug={movie.slug} />
                ))}
            </div>
        </section>
    );
}
