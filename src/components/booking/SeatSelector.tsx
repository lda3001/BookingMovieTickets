"use client";

import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import styles from './SeatSelector.module.css';

interface SeatSelectorProps {
    movieTitle: string;
    cinema: string;
    showtime: string;
    onClose: () => void;
}

// Seat Config
const ROWS = 10;
const COLS = 14;
const VIP_ROWS = [5, 6, 7];
// Generate some random sold seats
const SOLD_SEATS = ['E5', 'E6', 'F7', 'F8', 'G5'];

export default function SeatSelector({ movieTitle, cinema, showtime, onClose }: SeatSelectorProps) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const toggleSeat = (seatId: string) => {
        if (SOLD_SEATS.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= 8) {
                alert("Bạn chỉ được chọn tối đa 8 ghế.");
                return;
            }
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const getSeatPrice = (rIndex: number) => {
        if (VIP_ROWS.includes(rIndex)) return 110000; // VIP
        return 90000; // Standard
    };

    const totalPrice = selectedSeats.reduce((total, seatId) => {
        const rowIndex = seatId.charCodeAt(0) - 65; // 'A' -> 0
        return total + getSeatPrice(rowIndex);
    }, 0);

    const getRowLabel = (index: number) => String.fromCharCode(65 + index);

    return (
        <div className={styles.seatPage}>
            <header className={styles.header}>
                <div className={styles.backBtn} onClick={onClose}>
                    <ArrowLeft size={24} />
                </div>
                <div className={styles.headerInfo}>
                    <div className={styles.stepTitle}>{movieTitle}</div>
                    <div className={styles.headerSubtitle}>
                        <span className={styles.cinemaBadge}>{cinema}</span>
                        <span className={styles.timeBadge}>{showtime}</span>
                    </div>
                </div>
            </header>

            <div className={styles.screenArea}>
                <div className={styles.screen}></div>
                <div className={styles.screenText}>MÀN HÌNH</div>
            </div>

            <div className={styles.seatGrid}>
                {Array.from({ length: ROWS }).map((_, rIndex) => {
                    const rowLabel = getRowLabel(rIndex);
                    const isVip = VIP_ROWS.includes(rIndex);

                    return (
                        <div key={rIndex} className={styles.row}>
                            <div className={styles.rowLabel}>{rowLabel}</div>
                            {Array.from({ length: COLS }).map((_, cIndex) => {
                                // Skip middle aisle?
                                const seatId = `${rowLabel}${cIndex + 1}`;
                                const isSold = SOLD_SEATS.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                let seatClass = styles.seat;
                                if (isVip) seatClass += ` ${styles.vip}`;
                                else seatClass += ` ${styles.standard}`;

                                if (isSold) seatClass += ` ${styles.sold}`;
                                if (isSelected) seatClass += ` ${styles.selected}`;

                                return (
                                    <div
                                        key={seatId}
                                        className={seatClass}
                                        onClick={() => toggleSeat(seatId)}
                                    >
                                        {seatId}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendBox} ${styles.standard}`} style={{ background: 'white', borderColor: '#ddd' }}></div>
                    <span>Ghế thường - 90.000đ</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendBox} ${styles.vip}`} style={{ borderColor: '#ffd700', background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)' }}></div>
                    <span>Ghế VIP - 110.000đ</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendBox} ${styles.sold}`} style={{ background: '#ddd', borderColor: '#ccc' }}></div>
                    <span>Đã bán</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendBox} ${styles.selected}`} style={{ background: 'var(--galaxy-orange)', borderColor: 'var(--galaxy-orange)' }}></div>
                    <span>Đang chọn</span>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.totalInfo}>
                    <div className={styles.seatList}>
                        {selectedSeats.length > 0 ? (
                            <>
                                <strong>{selectedSeats.length}</strong> ghế: {selectedSeats.join(', ')}
                            </>
                        ) : (
                            'Chưa chọn ghế'
                        )}
                    </div>
                    <div className={styles.totalPrice}>
                        {totalPrice > 0 ? (
                            <>
                                {totalPrice.toLocaleString('vi-VN')} <span style={{ fontSize: '18px', fontWeight: '500' }}>đ</span>
                            </>
                        ) : (
                            '0 đ'
                        )}
                    </div>
                </div>
                <button
                    className={styles.continueBtn}
                    disabled={selectedSeats.length === 0}
                >
                    {selectedSeats.length > 0 ? `Tiếp tục (${selectedSeats.length} ghế)` : 'Chọn ghế để tiếp tục'}
                </button>
            </div>
        </div>
    );
}
