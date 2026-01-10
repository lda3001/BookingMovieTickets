"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './SeatSelector.module.css';
import { Showtime } from '@/types/api';
import { showtimeService, bookingService, roomService } from '@/services';
import { Room } from '@/types/api';
import dayjs from '@/lib/dayjs';
import { useRouter } from 'next/navigation';

interface SeatSelectorProps {
    movieTitle: string;
    showtime: Showtime;
    onClose: () => void;
}

interface Seat {
    id: string;
    rowLabel: string;
    seatNumber: number;
    isVip: boolean;
    price: number;
}

export default function SeatSelector({ movieTitle, showtime, onClose }: SeatSelectorProps) {
    const router = useRouter();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userId] = useState<number>(1); // TODO: Get from auth context

    useEffect(() => {
        const fetchData = async () => {
            if (!showtime.roomId) return;

            try {
                setLoading(true);
                
                // Fetch booked seats
                const booked = await showtimeService.getBookedSeats(showtime.id);
                setBookedSeats(booked);

                // Fetch room info
                const roomData = await roomService.getRoomById(showtime.roomId);
                setRoom(roomData);
            } catch (error) {
                console.error('Error fetching seat data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showtime.id, showtime.roomId]);

    const toggleSeat = (seatId: string) => {
        if (bookedSeats.includes(seatId)) return;

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

    const getSeatPrice = (seatId: string): number => {
        if (!room) return showtime.price || 90000;
        
        // Parse VIP rows if available
        let vipRows: (string | number)[] = [];
        if (room.vipRows) {
            try {
                vipRows = room.vipRows.split(',').map(row => row.trim());
            } catch {
                // If parsing fails, treat as empty
            }
        }

        const rowLabel = seatId.charAt(0);
        const rowIndex = rowLabel.charCodeAt(0) - 65; // 'A' -> 0
        
        // Check if row is VIP
        const isVip = vipRows.some(vr => {
            if (typeof vr === 'number') {
                return vr === rowIndex + 1; // 1-indexed
            }
            return vr === rowLabel;
        });

        // Use showtime price or default
        const basePrice = showtime.price || 90000;
        return isVip ? basePrice * 1.2 : basePrice; // VIP is 20% more
    };

    const totalPrice = selectedSeats.reduce((total, seatId) => {
        return total + getSeatPrice(seatId);
    }, 0);

    const getRowLabel = (index: number) => String.fromCharCode(65 + index);

    const handleBooking = async () => {
        if (selectedSeats.length === 0 || !showtime.id) return;

        try {
            setSubmitting(true);
            const booking = await bookingService.createBooking({
                userId,
                showtimeId: showtime.id,
                seatCodes: selectedSeats,
            });

            // Redirect to payment page
            router.push(`/thanh-toan/${booking.bookingCode}`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.');
            console.error('Error creating booking:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Generate seats based on room config or defaults
    const ROWS = room?.totalRows || 10;
    const COLS = room?.seatsPerRow || 14;
    
    // Parse VIP rows
    let vipRows: (string | number)[] = [];
    if (room?.vipRows) {
        try {
            //room.vipRows = A,B
            //convert to array
            vipRows = room.vipRows.split(',').map(row => row.trim());
            console.log(vipRows);
        } catch {
            vipRows = [];
        }
    }

    const isVipRow = (rowIndex: number, rowLabel: string): boolean => {
        return vipRows.some(vr => {
            if (typeof vr === 'number') {
                return vr === rowIndex + 1;
            }
            return vr === rowLabel;
        });
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const t = dayjs(timeStr, 'DD/MM/YYYY HH:mm', true);
        return t.isValid() ? t.format('HH:mm') : timeStr;
    };

    if (loading) {
        return (
            <div className={styles.seatPage}>
                <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải thông tin ghế...</div>
            </div>
        );
    }

    return (
        <div className={styles.seatPage}>
            <header className={styles.header}>
                <div className={styles.backBtn} onClick={onClose}>
                    <ArrowLeft size={24} />
                </div>
                <div className={styles.headerInfo}>
                    <div className={styles.stepTitle}>{movieTitle}</div>
                    <div className={styles.headerSubtitle}>
                        <span className={styles.cinemaBadge}>{showtime.cinemaName || 'Rạp'}</span>
                        <span className={styles.timeBadge}>{formatTime(showtime.showTime)}</span>
                        {showtime.roomName && (
                            <span className={styles.timeBadge}>{showtime.roomName}</span>
                        )}
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
                    const isVip = isVipRow(rIndex, rowLabel);

                    return (
                        <div key={rIndex} className={styles.row}>
                            <div className={styles.rowLabel}>{rowLabel}</div>
                            {Array.from({ length: COLS }).map((_, cIndex) => {
                                const seatId = `${rowLabel}${cIndex + 1}`;
                                const isSold = bookedSeats.includes(seatId);
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
                    <span>Ghế thường - {Math.round((showtime.price || 90000)).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendBox} ${styles.vip}`} style={{ borderColor: '#ffd700', background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)' }}></div>
                    <span>Ghế VIP - {Math.round((showtime.price || 90000) * 1.2).toLocaleString('vi-VN')}đ</span>
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
                                {Math.round(totalPrice).toLocaleString('vi-VN')} <span style={{ fontSize: '18px', fontWeight: '500' }}>đ</span>
                            </>
                        ) : (
                            '0 đ'
                        )}
                    </div>
                </div>
                <button
                    className={styles.continueBtn}
                    disabled={selectedSeats.length === 0 || submitting}
                    onClick={handleBooking}
                >
                    {submitting 
                        ? 'Đang xử lý...' 
                        : selectedSeats.length > 0 
                            ? `Đặt vé (${selectedSeats.length} ghế)` 
                            : 'Chọn ghế để tiếp tục'}
                </button>
            </div>
        </div>
    );
}
