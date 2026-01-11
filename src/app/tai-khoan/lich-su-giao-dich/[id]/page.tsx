"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Armchair, CreditCard, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Booking, BookingStatus } from '@/types/api';
import { bookingService } from '@/services/bookingService';
import styles from './page.module.css';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingCode = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingCode) {
      loadBookingDetail();
    }
  }, [bookingCode]);

  const loadBookingDetail = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getBookingByCode(bookingCode);
      setBooking(data);
    } catch (err: any) {
      console.error('Error loading booking detail:', err);
      setError('Không thể tải thông tin đặt vé. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    const labels: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: 'Chờ thanh toán',
      [BookingStatus.CONFIRMED]: 'Đã xác nhận',
      [BookingStatus.CANCELLED]: 'Đã hủy',
      [BookingStatus.COMPLETED]: 'Hoàn thành',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: BookingStatus) => {
    if (status === BookingStatus.CONFIRMED || status === BookingStatus.COMPLETED) {
      return <CheckCircle size={24} className={styles.successIcon} />;
    }
    if (status === BookingStatus.CANCELLED) {
      return <XCircle size={24} className={styles.errorIcon} />;
    }
    return null;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      // Kiểm tra input có chứa giây không
      const hasSeconds = /:\d{2}:\d{2}/.test(dateString);

      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...(hasSeconds && { second: '2-digit' }),
      });
    } catch {
      return dateString;
    }
  };


  const formatPrice = (price?: number): string => {
    if (!price) return '0đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Không tìm thấy thông tin đặt vé'}</p>
          <button onClick={() => router.back()} className={styles.backButton}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backLink}>
        <ArrowLeft size={20} />
        <span>Quay lại</span>
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{booking.movieTitle}</h1>
            <p className={styles.bookingCode}>Mã đặt vé: {booking.bookingCode}</p>
          </div>
          <div className={styles.statusBadge}>
            {getStatusIcon(booking.status)}
            <span>{getStatusLabel(booking.status)}</span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông tin suất chiếu</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Calendar size={20} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Thời gian</div>
                <div className={styles.infoValue}>{formatDate(booking.showTime)}</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <MapPin size={20} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Rạp chiếu</div>
                <div className={styles.infoValue}>
                  {booking.cinemaName} - {booking.roomName}
                </div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Armchair size={20} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Ghế ngồi</div>
                <div className={styles.infoValue}>
                  {booking.seatCodes?.join(', ') || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông tin thanh toán</h2>
          <div className={styles.paymentInfo}>
            <div className={styles.paymentRow}>
              <span>Số lượng vé</span>
              <span>{booking.seatCodes?.length || 0} vé</span>
            </div>
            <div className={styles.paymentRow}>
              <span>Phương thức thanh toán</span>
              <span>{booking.paymentMethod || 'Chưa thanh toán'}</span>
            </div>
            <div className={styles.paymentRow}>
              <span>Trạng thái thanh toán</span>
              <span>{booking.paymentStatus || 'Chưa thanh toán'}</span>
            </div>
            <div className={`${styles.paymentRow} ${styles.total}`}>
              <span>Tổng tiền</span>
              <span className={styles.totalPrice}>{formatPrice(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Mã QR Vé</h2>
          <div className={styles.qrCode}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingCode}`}
              alt="QR Code"
            />
          </div>
        </div>

        <div className={styles.divider}></div>


        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông tin khác</h2>
          <div className={styles.metaInfo}>
            <div className={styles.metaRow}>
              <span>Ngày đặt vé</span>
              <span>{formatDate(booking.createdAt)}</span>
            </div>
            {booking.updatedAt && (
              <div className={styles.metaRow}>
                <span>Cập nhật lần cuối</span>
                <span>{formatDate(booking.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
