"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PaymentPage.module.css';
import { Booking, BookingStatus } from '@/types/api';
import { bookingService } from '@/services';
import dayjs from '@/lib/dayjs';
import { CheckCircle, Clock, CreditCard, QrCode, Smartphone, XCircle } from 'lucide-react';

interface PaymentPageProps {
    booking: Booking;

}

type PaymentMethod = 'qr' | 'card' | 'ewallet';

export default function PaymentPage({ booking: initialBooking }: PaymentPageProps) {
    const router = useRouter();
    const [booking, setBooking] = useState<Booking>(initialBooking);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qr');
    const [processing, setProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(getTimeLeftFromTicketCode(booking.bookingCode)); // 10 minutes in seconds
    const [showSuccess, setShowSuccess] = useState(false);
    

    // Countdown timer
    useEffect(() => {
        if (booking.status !== BookingStatus.PENDING) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleCancelBooking();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [booking.status]);

    function getTimeLeftFromTicketCode(ticketCode: string) {
        // Lấy timestamp từ ticket code
        const timestamp = Number(ticketCode.replace('GC', '')); // ms
      
        const createdAt = timestamp;
        const now = Date.now();
      
        // Thời gian đã trôi qua (giây)
        const elapsedSeconds = Math.floor((now - createdAt) / 1000);
      
        // Thời gian còn lại
        return Math.max(180 - elapsedSeconds, 0);
      }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleCancelBooking = async () => {
        try {
            await bookingService.cancelBooking(booking.bookingCode);
            router.push('/');
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    const handlePayment = async () => {
        if (processing) return;

        try {
            setProcessing(true);

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Confirm booking
            const confirmedBooking = await bookingService.confirmBooking(booking.bookingCode, selectedMethod as PaymentMethod);
            setBooking(confirmedBooking);
            if (confirmedBooking.status === "CONFIRMED") {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push(`/booking/success/${booking.bookingCode}`);
                }, 3000);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
            console.error('Error processing payment:', error);
        } finally {
            setProcessing(false);
        }
    };

    const formatShowtime = (timeStr: string | undefined) => {
        if (!timeStr) return '';
        const t = dayjs(timeStr, 'DD/MM/YYYY HH:mm', true);
        return t.isValid() ? t.format('HH:mm - DD/MM/YYYY') : timeStr;
    };

    const getStatusColor = () => {
        switch (booking.status) {
            case BookingStatus.CONFIRMED:
            case BookingStatus.COMPLETED:
                return '#28a745';
            case BookingStatus.CANCELLED:
                return '#dc3545';
            default:
                return '#ffc107';
        }
    };

    const getStatusText = () => {
        switch (booking.status) {
            case BookingStatus.CONFIRMED:
                return 'Đã xác nhận';
            case BookingStatus.COMPLETED:
                return 'Hoàn thành';
            case BookingStatus.CANCELLED:
                return 'Đã hủy';
            default:
                return 'Chờ thanh toán';
        }
    };

    if (showSuccess) {
        return (
            <div className={styles.successOverlay}>
                <div className={styles.successCard}>
                    <CheckCircle size={80} color="#28a745" />
                    <h2>Thanh toán thành công!</h2>
                    <p>Bạn sẽ được chuyển đến trang xác nhận...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.paymentPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Thanh Toán</h1>
                    {booking.status === BookingStatus.PENDING && (
                        <div className={styles.timer}>
                            <Clock size={20} />
                            <span>Thời gian còn lại: <strong>{formatTime(timeLeft)}</strong></span>
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    {/* Left Column - Booking Info */}
                    <div className={styles.leftColumn}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2>Thông Tin Đặt Vé</h2>
                                <span 
                                    className={styles.statusBadge}
                                    style={{ backgroundColor: getStatusColor() }}
                                >
                                    {getStatusText()}
                                </span>
                            </div>

                            <div className={styles.bookingInfo}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Mã đặt vé:</span>
                                    <span className={styles.value}>{booking.bookingCode}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Phim:</span>
                                    <span className={styles.value}>{booking.movieTitle}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Rạp:</span>
                                    <span className={styles.value}>{booking.cinemaName}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Phòng:</span>
                                    <span className={styles.value}>{booking.roomName}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Suất chiếu:</span>
                                    <span className={styles.value}>{formatShowtime(booking.showTime)}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Ghế:</span>
                                    <span className={styles.value}>
                                        {booking.seatCodes?.join(', ') || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {booking.status === BookingStatus.PENDING && (
                            <div className={styles.card}>
                                <h3>Chọn Phương Thức Thanh Toán</h3>
                                
                                <div className={styles.paymentMethods}>
                                    <div 
                                        className={`${styles.methodCard} ${selectedMethod === 'qr' ? styles.active : ''}`}
                                        onClick={() => setSelectedMethod('qr')}
                                    >
                                        <QrCode size={32} />
                                        <span>Quét mã QR</span>
                                        <div className={styles.radio}>
                                            <input 
                                                type="radio" 
                                                checked={selectedMethod === 'qr'} 
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div 
                                        className={`${styles.methodCard} ${selectedMethod === 'card' ? styles.active : ''}`}
                                        onClick={() => setSelectedMethod('card')}
                                    >
                                        <CreditCard size={32} />
                                        <span>Thẻ tín dụng</span>
                                        <div className={styles.radio}>
                                            <input 
                                                type="radio" 
                                                checked={selectedMethod === 'card'} 
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div 
                                        className={`${styles.methodCard} ${selectedMethod === 'ewallet' ? styles.active : ''}`}
                                        onClick={() => setSelectedMethod('ewallet')}
                                    >
                                        <Smartphone size={32} />
                                        <span>Ví điện tử</span>
                                        <div className={styles.radio}>
                                            <input 
                                                type="radio" 
                                                checked={selectedMethod === 'ewallet'} 
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                {selectedMethod === 'qr' && (
                                    <div className={styles.qrSection}>
                                        <div className={styles.qrCode}>
                                            <img 
                                                src={`https://img.vietqr.io/image/MBBank-3018686868686-qr_only.png?amount=${booking.totalPrice}&addInfo=${booking.bookingCode}&accountName=LE%20DUC%20ANH`}
                                                alt="QR Code"
                                            />
                                        </div>
                                        <p>Quét mã QR để thanh toán</p>
                                    </div>
                                )}

                                {selectedMethod === 'card' && (
                                    <div className={styles.cardForm}>
                                        <input type="text" placeholder="Số thẻ" className={styles.input} />
                                        <div className={styles.row}>
                                            <input type="text" placeholder="MM/YY" className={styles.input} />
                                            <input type="text" placeholder="CVV" className={styles.input} />
                                        </div>
                                        <input type="text" placeholder="Tên chủ thẻ" className={styles.input} />
                                    </div>
                                )}

                                {selectedMethod === 'ewallet' && (
                                    <div className={styles.ewalletOptions}>
                                        <button className={styles.walletBtn}>
                                            <img src="/momo.png" alt="MoMo" onError={(e) => e.currentTarget.style.display = 'none'} />
                                            MoMo
                                        </button>
                                        <button className={styles.walletBtn}>
                                            <img src="/zalopay.png" alt="ZaloPay" onError={(e) => e.currentTarget.style.display = 'none'} />
                                            ZaloPay
                                        </button>
                                        <button className={styles.walletBtn}>
                                            <img src="/vnpay.png" alt="VNPay" onError={(e) => e.currentTarget.style.display = 'none'} />
                                            VNPay
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Price Summary */}
                    <div className={styles.rightColumn}>
                        <div className={styles.card}>
                            <h3>Chi Tiết Giá</h3>
                            
                            <div className={styles.priceBreakdown}>
                                <div className={styles.priceRow}>
                                    <span>Vé phim ({booking.seatCodes?.length || 0} ghế)</span>
                                    <span>{(booking.totalPrice || 0).toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <span>Phí dịch vụ</span>
                                    <span>0đ</span>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.priceRow} style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    <span>Tổng cộng</span>
                                    <span style={{ color: 'var(--galaxy-orange)' }}>
                                        {(booking.totalPrice || 0).toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            </div>

                            {booking.status === BookingStatus.PENDING && (
                                <>
                                    <button 
                                        className={styles.payButton}
                                        onClick={handlePayment}
                                        disabled={processing}
                                    >
                                        {processing ? 'Đang xử lý...' : 'Thanh Toán'}
                                    </button>

                                    <button 
                                        className={styles.cancelButton}
                                        onClick={handleCancelBooking}
                                        disabled={processing}
                                    >
                                        Hủy đặt vé
                                    </button>
                                </>
                            )}

                            {booking.status === BookingStatus.CANCELLED && (
                                <div className={styles.cancelledMessage}>
                                    <XCircle size={24} color="#dc3545" />
                                    <p>Đặt vé đã bị hủy</p>
                                </div>
                            )}

                            {(booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED) && (
                                <div className={styles.confirmedMessage}>
                                    <CheckCircle size={24} color="#28a745" />
                                    <p>Đặt vé đã được xác nhận</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.note}>
                            <h4>Lưu ý:</h4>
                            <ul>
                                <li>Vui lòng thanh toán trong thời gian quy định</li>
                                <li>Vé đã mua không thể hoàn trả</li>
                                <li>Vui lòng mang theo mã đặt vé khi đến rạp</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
