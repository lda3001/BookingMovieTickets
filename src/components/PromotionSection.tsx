"use client";

import React, { useState, useEffect } from 'react';
import styles from './PromotionSection.module.css';

const PROMOS = [
    {
        id: 1,
        title: 'Galaxy Cinema Và MoMo Tặng Bắp Nước Miễn Phí',
        image: 'https://cdn.galaxycine.vn/media/2025/9/4/momo-galaxy-3_1756958677195.jpg'
    },
    {
        id: 2,
        title: 'Voucher ShopeePay Giảm 50K Dành Tặng Các Stars!',
        image: 'https://cdn.galaxycine.vn/media/2025/12/1/shopee-1_1764600140405.jpg'
    },
    {
        id: 3,
        title: 'Tất For You - Feliz Navidad – Xem Phim Hay Nhận Quà Liền Tay',
        image: 'https://cdn.galaxycine.vn/media/2025/11/25/2048_1764059977322.jpg'
    },
    {
        id: 4,
        title: 'Triệu Hồi Năng Lượng Chú Thuật – Săn Figurine Siêu Đỉnh Tại Galaxy Cinema!',
        image: 'https://cdn.galaxycine.vn/media/2025/11/25/2048_1764057654567.jpg'
    },
    {
        id: 5,
        title: 'IMAX Hunter',
        image: 'https://cdn.galaxycine.vn/media/2025/9/24/imax-treasure-hunt--s4_1758703859745.jpg'
    },
    {
        id: 6,
        title: 'ZaloPay Khao Cả Năm',
        image: 'https://cdn.galaxycine.vn/media/2025/8/26/2048-zalopay_1756202416336.png'
    },
    {
        id: 7,
        title: 'Galaxy Li-Xi: Tải App Nhận Quà',
        image: 'https://cdn.galaxycine.vn/media/2025/9/26/lio-t9-galaxy-banner-app-2048x682_1758894535113.jpg'
    },
    {
        id: 8,
        title: 'Quyền Lợi Thành Viên 2024',
        image: 'https://cdn.galaxycine.vn/media/2024/1/12/1200x800_1705051187788.jpg'
    }
];

export default function PromotionSection() {
    const [activeSlide, setActiveSlide] = useState(0);
    const itemsToShow = 4; // Show 4 items at a time
    const maxSlide = Math.ceil(PROMOS.length / itemsToShow) - 1;

    // Auto-play logic
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(timer);
    }, [maxSlide]);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Tin khuyến mãi</h2>
                </div>

                <div className={styles.sliderContainer}>
                    {/* 
               Slide by moving the track left by 100% * activeSlide.
               We assume the track width correlates to how many "pages" of items we have.
               Alternatively, we can slide by pixel amount relative to item width.
               Here we will slide by 100% of the visible container width.
            */}
                    <div
                        className={styles.track}
                        style={{
                            transform: `translateX(-${(activeSlide * 100) / (maxSlide + 1)}%)`,
                            width: `${(maxSlide + 1) * 100}%` /* Make track wide enough */
                        }}
                    >
                        {
                            /* 
                               Each slide group needs to be 1 / totalWidth fraction of the track.
                               e.g. if track is 200% width (2 slides), each slide is 50% of track.
                            */
                            Array.from({ length: maxSlide + 1 }).map((_, pageIndex) => (
                                <div
                                    key={pageIndex}
                                    className={styles.slideGroup}
                                    style={{
                                        width: `${100 / (maxSlide + 1)}%`, // Fix width to fraction of track
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: 24
                                    }}
                                >
                                    {PROMOS.slice(pageIndex * itemsToShow, (pageIndex + 1) * itemsToShow).map(promo => (
                                        <div key={promo.id} className={styles.promoItem} style={{ width: '100%' }}>
                                            <div className={styles.imageWrapper}>
                                                <img src={promo.image} alt={promo.title} className={styles.image} />
                                            </div>
                                            <h3 className={styles.promoTitle}>{promo.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={styles.dots}>
                    {Array.from({ length: maxSlide + 1 }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`${styles.dot} ${idx === activeSlide ? styles.activeDot : ''}`}
                            onClick={() => setActiveSlide(idx)}
                        ></div>
                    ))}
                </div>

            </div>
        </section>
    );
}
