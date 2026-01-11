"use client";

import React from 'react';
import { notFound, useRouter } from 'next/navigation';
import styles from './BookingSuccess.module.css';
import { Booking } from '@/types/api';
import dayjs from '@/lib/dayjs';
import { CheckCircle, Download, Mail, Printer, Home } from 'lucide-react';

interface BookingSuccessProps {
    booking: Booking;
}

export default function BookingSuccess({ booking }: BookingSuccessProps) {
    const router = useRouter();
    if (booking.status !== "CONFIRMED") {
        notFound();
        return;
    }

    const formatShowtime = (timeStr: string | undefined) => {
        if (!timeStr) return '';
        const t = dayjs(timeStr, 'DD/MM/YYYY HH:mm', true);
        return t.isValid() ? t.format('HH:mm - DD/MM/YYYY') : timeStr;
    };

    const formatDate = (timeStr: string | undefined) => {
        if (!timeStr) return '';
        const t = dayjs(timeStr, 'DD/MM/YYYY HH:mm', true);
        return t.isValid() ? t.format('dddd, DD/MM/YYYY') : timeStr;
    };

    const formatTime = (timeStr: string | undefined) => {
        if (!timeStr) return '';
        const t = dayjs(timeStr, 'DD/MM/YYYY HH:mm', true);
        return t.isValid() ? t.format('HH:mm') : timeStr;
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // TODO: Implement download ticket as PDF
        alert('Chức năng tải vé sẽ sớm được cập nhật');
    };

    const handleSendEmail = () => {
        // TODO: Implement send email
        alert('Vé đã được gửi đến email của bạn');
    };

    return (
        <div className={styles.successPage}>
            <div className={styles.container}>
                <div className={styles.successHeader}>
                    <div className={styles.iconWrapper}>
                        <CheckCircle size={80} />
                    </div>
                    <h1>Đặt Vé Thành Công!</h1>
                    <p>Cảm ơn bạn đã đặt vé tại Galaxy Cinema</p>
                </div>

                <div className={styles.ticketCard}>
                    <div className={styles.ticketHeader}>
                        <div className={styles.logo}>
                            <h2>GALAXY CINEMA</h2>
                        </div>
                        <div className={styles.bookingCode}>
                            <span>Mã đặt vé</span>
                            <strong>{booking.bookingCode}</strong>
                        </div>
                    </div>

                    <div className={styles.movieTitle}>
                        {booking.movieTitle}
                    </div>

                    <div className={styles.ticketDetails}>
                        <div className={styles.detailRow}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Rạp chiếu</span>
                                <span className={styles.detailValue}>{booking.cinemaName}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Phòng</span>
                                <span className={styles.detailValue}>{booking.roomName}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Ngày chiếu</span>
                                <span className={styles.detailValue}>{formatDate(booking.showTime)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Giờ chiếu</span>
                                <span className={styles.detailValue}>{formatTime(booking.showTime)}</span>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Ghế ngồi</span>
                                <span className={styles.detailValue}>
                                    {booking.seatCodes?.join(', ')}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Số lượng</span>
                                <span className={styles.detailValue}>
                                    {booking.seatCodes?.length || 0} vé
                                </span>
                            </div>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.totalPrice}>
                            <span>Tổng tiền</span>
                            <span className={styles.price}>
                                {(booking.totalPrice || 0).toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </div>

                    <div className={styles.qrSection}>
                        <div className={styles.qrCode}>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingCode}`}
                                alt="QR Code"
                            />
                        </div>
                        <p>Vui lòng xuất trình mã này tại quầy để nhận vé</p>
                    </div>

                    <div className={styles.noticeBox}>
                        <h4>Lưu ý quan trọng:</h4>
                        <ul>
                            <li>Vui lòng đến rạp trước giờ chiếu ít nhất 15 phút</li>
                            <li>Xuất trình mã QR hoặc mã đặt vé tại quầy để nhận vé</li>
                            <li>Vé đã mua không thể đổi hoặc hoàn lại</li>
                            <li>Không được mang thực phẩm từ bên ngoài vào rạp</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={handlePrint}>
                        <Printer size={20} />
                        In vé
                    </button>
                    <button className={styles.actionBtn} onClick={handleDownload}>
                        <Download size={20} />
                        Tải xuống
                    </button>
                    <button className={styles.actionBtn} onClick={handleSendEmail}>
                        <Mail size={20} />
                        Gửi email
                    </button>
                </div>

                <button 
                    className={styles.homeBtn}
                    onClick={() => router.push('/')}
                >
                    <Home size={20} />
                    Về trang chủ
                </button>

                <div className={styles.footer}>
                    <p>Chúc bạn có trải nghiệm xem phim tuyệt vời tại Galaxy Cinema! 🎬</p>
                </div>
            </div>
        </div>
    );
}
