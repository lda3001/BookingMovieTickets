"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import styles from './HeroSlider.module.css';

interface Slide {
    image: string;
    alt: string;
    title?: string;
    subtitle?: string;
    link?: string;
}

const SLIDES: Slide[] = [
    {
        image: 'https://cdn.galaxycine.vn/media/2025/12/4/ctrr-3_1764834363821.jpg',
        alt: 'Chân Trời Rực Rỡ',
        title: 'Chân Trời Rực Rỡ',
        subtitle: 'Phim bom tấn đang chiếu',
        link: '/dat-ve/chan-troi-ruc-ro'
    },
    {
        image: 'https://cdn.galaxycine.vn/media/2025/11/3/glx-2048x682_1762159408722.jpg',
        alt: 'Zootopia 2',
        title: 'Zootopia 2',
        subtitle: 'Cuộc phiêu lưu mới đầy hấp dẫn',
        link: '/dat-ve/zootopia-2'
    },
    {
        image: 'https://cdn.galaxycine.vn/media/2025/11/20/avatar-fire-and-ash-2_1763629183877.jpg',
        alt: 'Avatar: Fire And Ash',
        title: 'Avatar: Fire And Ash',
        subtitle: 'Trải nghiệm điện ảnh đỉnh cao',
        link: '/dat-ve/avatar-fire-and-ash'
    },
    {
        image: 'https://cdn.galaxycine.vn/media/2025/9/26/lio-t9-galaxy-banner-app-2048x682_1758894535113.jpg',
        alt: 'Galaxy x Liobank',
        title: 'Ưu đãi đặc biệt',
        subtitle: 'Giảm ngay 60K khi thanh toán',
    },
    {
        image: 'https://cdn.galaxycine.vn/media/2025/11/27/2048_1764234278673.jpg',
        alt: 'Jujutsu Kaisen',
        title: 'Jujutsu Kaisen',
        subtitle: 'Sắp ra mắt',
        link: '/dat-ve/jujutsu-kaisen'
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        if (!isPaused) {
            resetTimeout();
            timeoutRef.current = setTimeout(
                () => setCurrent((prev) => (prev + 1) % SLIDES.length),
                5000
            );
        }

        return () => resetTimeout();
    }, [current, isPaused]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrent(index);
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    return (
        <div 
            className={styles.sliderContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={sliderRef}
        >
            <div
                className={styles.slidesWrapper}
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {SLIDES.map((slide, index) => (
                    <div key={index} className={styles.slide}>
                        <img
                            src={slide.image}
                            alt={slide.alt}
                            className={styles.slideImage}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                        <div className={styles.overlay} />
                        {(slide.title || slide.subtitle) && (
                            <div className={styles.content}>
                                {slide.title && (
                                    <h2 className={styles.title}>{slide.title}</h2>
                                )}
                                {slide.subtitle && (
                                    <p className={styles.subtitle}>{slide.subtitle}</p>
                                )}
                                {slide.link && (
                                    <Link href={slide.link} className={styles.ctaButton}>
                                        <Play size={20} />
                                        <span>Đặt vé ngay</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button 
                className={`${styles.navBtn} ${styles.prevBtn}`} 
                onClick={prevSlide}
                aria-label="Slide trước"
            >
                <ChevronLeft size={24} />
            </button>

            <button 
                className={`${styles.navBtn} ${styles.nextBtn}`} 
                onClick={nextSlide}
                aria-label="Slide sau"
            >
                <ChevronRight size={24} />
            </button>

            <div className={styles.dots}>
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === current ? styles.activeDot : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Chuyển đến slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className={styles.progressBar}>
                <div 
                    className={styles.progressFill}
                    style={{ 
                        width: `${((current + 1) / SLIDES.length) * 100}%`,
                        transition: isPaused ? 'none' : 'width 5s linear'
                    }}
                />
            </div>
        </div>
    );
}
