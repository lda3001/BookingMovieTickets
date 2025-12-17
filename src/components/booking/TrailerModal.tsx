"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './TrailerModal.module.css';

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    trailerUrl?: string;
    movieTitle: string;
}

export default function TrailerModal({ isOpen, onClose, trailerUrl, movieTitle }: TrailerModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Extract YouTube video ID from URL
    const getYouTubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = trailerUrl ? getYouTubeId(trailerUrl) : null;
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
                    <X size={24} />
                </button>
                
                {embedUrl ? (
                    <div className={styles.videoContainer}>
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            title={`Trailer ${movieTitle}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.video}
                        />
                    </div>
                ) : (
                    <div className={styles.noTrailer}>
                        <p>Trailer chưa có sẵn cho phim này.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

