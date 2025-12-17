"use client";

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import styles from './NowShowingSidebar.module.css';
import { MOVIES } from '@/data/movies';

export default function NowShowingSidebar({ currentMovieId }: { currentMovieId?: number }) {
    // Get now showing movies (exclude current movie and coming soon)
    const nowShowing = MOVIES.filter(m => 
        m.rating !== 'N/A' && m.id !== currentMovieId
    ).slice(0, 3);

    return (
        <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>PHIM ĐANG CHIẾU</h3>
            <div className={styles.movieList}>
                {nowShowing.map(movie => (
                    <Link 
                        key={movie.id} 
                        href={`/dat-ve/${movie.slug}`}
                        className={styles.movieItem}
                    >
                        <div className={styles.moviePoster}>
                            <img src={movie.image} alt={movie.title} />
                            <div className={styles.ratingBadge}>
                                <Star size={12} fill="currentColor" />
                                <span>{movie.rating}</span>
                            </div>
                        </div>
                        <div className={styles.movieInfo}>
                            <h4 className={styles.movieTitle}>{movie.title}</h4>
                            <div className={styles.movieRating}>
                                <Star size={14} fill="currentColor" />
                                <span>{movie.rating}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}


