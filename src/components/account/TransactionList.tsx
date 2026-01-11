"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Armchair, CreditCard, ChevronRight } from 'lucide-react';
import { Booking, BookingStatus } from '@/types/api';
import { bookingService } from '@/services/bookingService';
import { authService } from '@/services/authService';
import styles from './TransactionList.module.css';

export default function TransactionList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);

      const data = await bookingService.getUserBookings();
      // Sort by date, newest first
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setBookings(sortedData);
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.');
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

  const getStatusClass = (status: BookingStatus): string => {
    const classes: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: styles.statusPending,
      [BookingStatus.CONFIRMED]: styles.statusConfirmed,
      [BookingStatus.CANCELLED]: styles.statusCancelled,
      [BookingStatus.COMPLETED]: styles.statusCompleted,
    };
    return classes[status] || '';
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

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadBookings} className={styles.retryButton}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lịch sử giao dịch</h1>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`${styles.filterButton} ${filter === BookingStatus.CONFIRMED ? styles.active : ''}`}
            onClick={() => setFilter(BookingStatus.CONFIRMED)}
          >
            Đã xác nhận
          </button>
          <button
            className={`${styles.filterButton} ${filter === BookingStatus.COMPLETED ? styles.active : ''}`}
            onClick={() => setFilter(BookingStatus.COMPLETED)}
          >
            Hoàn thành
          </button>
          <button
            className={`${styles.filterButton} ${filter === BookingStatus.CANCELLED ? styles.active : ''}`}
            onClick={() => setFilter(BookingStatus.CANCELLED)}
          >
            Đã hủy
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className={styles.empty}>
          <p>Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filteredBookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/tai-khoan/lich-su-giao-dich/${booking.bookingCode}`}
              className={styles.bookingCard}
            >
              <div className={styles.cardHeader}>
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{booking.movieTitle || 'N/A'}</h3>
                  <span className={`${styles.status} ${getStatusClass(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
                <ChevronRight size={20} className={styles.chevron} />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <Calendar size={16} />
                  <span>{formatDate(booking.showTime)}</span>
                </div>
                <div className={styles.infoRow}>
                  <MapPin size={16} />
                  <span>{booking.cinemaName || 'N/A'} - {booking.roomName || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <Armchair size={16} />
                  <span>{booking.seatCodes?.join(', ') || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <CreditCard size={16} />
                  <span className={styles.price}>{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.bookingCode}>Mã đặt vé: {booking.bookingCode}</span>
                <span className={styles.date}>
                  {formatDate(booking.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
