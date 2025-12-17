"use client";

import React, { useState } from 'react';
import { Star, Clock, Calendar, MapPin, Film, Users, User, Play } from 'lucide-react';
import styles from './MovieInfo.module.css';
import TrailerModal from './TrailerModal';
import { Movie } from '@/types/api';

interface MovieInfoProps {
    movie: {
        title: string;
        image: string;
        duration: string;
        rating: string;
        releaseDate?: string;
        country?: string;
        producer?: string[];
        genre?: string[];
        director?: string;
        cast?: string[];
        trailerUrl?: string;
    };
}

export default function MovieInfo({ movie }: { movie: Movie }) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.posterWrapper}>
                    <img
                        src={movie.image}
                        alt={movie.title}
                        className={styles.poster}
                    />
                    {movie.trailerUrl && (
                        <button 
                            className={styles.playButton}
                            onClick={() => setIsTrailerOpen(true)}
                            aria-label="Xem trailer"
                        >
                            <Play size={32} fill="currentColor" />
                        </button>
                    )}
                </div>

                <div className={styles.info}>
                    <h1 className={styles.title}>{movie.title}</h1>

                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <Clock size={16} />
                            <span>{movie.duration}</span>
                        </div>
                        {movie.releaseDate && (
                            <div className={styles.metaItem}>
                                <Calendar size={16} />
                                <span>{movie.releaseDate}</span>
                            </div>
                        )}
                        <div className={styles.metaItem}>
                            <Star size={16} fill="currentColor" />
                            <span className={styles.ratingValue}>{movie.rating}</span>
                            <span className={styles.ratingLabel}>(39 votes)</span>
                        </div>
                    </div>

                    {/* Movie Details */}
                    <div className={styles.detailsList}>
                        {movie.country && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Quốc gia:</span>
                                <span className={styles.detailValue}>{movie.country}</span>
                            </div>
                        )}
                        {movie.producer && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Nhà sản xuất:</span>
                                <div className={styles.detailValueList}>
                                    {movie.producer.split(',').map((p: string, idx: number, arr: string[]) => (
                                        <span key={idx} className={styles.detailValue}>
                                            {p.trim()}
                                            {idx < arr.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {movie.genre && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Thể loại:</span>
                                <div className={styles.detailValueList}>
                                    {movie.genre.split(',').map((g: string, idx: number, arr: string[]) => (
                                        <span key={idx} className={styles.detailValue}>
                                            {g.trim()}
                                            {idx < arr.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {movie.director && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Đạo diễn:</span>
                                <span className={styles.detailValue}>{movie.director}</span>
                            </div>
                        )}
                        {movie.cast && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Diễn viên:</span>
                                <div className={styles.detailValueList}>
                                    {movie.cast.split(',').map((c: string, idx: number, arr: string[]) => (
                                        <span key={idx} className={styles.detailValue}>
                                            {c.trim()}
                                            {idx < arr.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.note}>
                        * Lưu ý: Khán giả dưới 13 tuổi chỉ được xem phim khi có người giám hộ đi kèm.
                    </div>
                </div>
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
