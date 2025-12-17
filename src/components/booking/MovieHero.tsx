"use client";

import React, { useState } from 'react';
import { Play, Calendar } from 'lucide-react';
import styles from './MovieHero.module.css';
import TrailerModal from './TrailerModal';
import { Movie } from '@/types/api';

interface MovieHeroProps {
    movie: Movie;
}

export default function MovieHero({ movie }: { movie: Movie }) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    // Split title for display
    const titleParts = movie.title.split(':');
    const mainTitle = titleParts[0] || movie.title;
    const subtitle = movie.subtitle || titleParts.slice(1).join(':') || '';

    return (
        <>
            <div className={styles.heroSection}>
                {movie.image && (
                    <>
                        <div className={styles.blurLeft}>
                            <img src={movie.image} alt={movie.title} />
                        </div>
                        <div className={styles.blurRight}>
                            <img src={movie.image} alt={movie.title} />
                        </div>
                    </>
                )}
                <div className={styles.heroContent}>
                    <div className={styles.heroTextOverlay}>
                        {movie.tagline && (
                            <div className={styles.tagline}>{movie.tagline}</div>
                        )}
                        <div className={styles.movieLabel}>THE MOVIE</div>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroTitleMain}>{mainTitle}</span>
                            {subtitle && (
                                <span className={styles.heroTitleSub}>— {subtitle} —</span>
                            )}
                            {movie.trailerUrl && (
                                <button 
                                    className={styles.playButton}
                                    onClick={() => setIsTrailerOpen(true)}
                                    aria-label="Xem trailer"
                                >
                                    <Play size={40} fill="currentColor" />
                                </button>
                            )}
                        </h1>
                        <div className={styles.imaxLabel}>TRẢI NGHIỆM VỚI ĐỊNH DẠNG IMAX</div>
                        {movie.releaseDate && (
                            <>
                                <div className={styles.releaseDate}>
                                    {movie.releaseDate.replace(/\//g, '.')}
                                </div>
                                <div className={styles.releaseLabel}>CHÍNH THỨC KHỞI CHIẾU</div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.ageBadge}>T16</div>
            </div>

            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={movie.trailerUrl}
                movieTitle={movie.title}
            />
        </>
    );
}

