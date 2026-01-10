import React from 'react';
import { notFound } from 'next/navigation';
import { bookingService } from '@/services';
import BookingSuccess from '@/components/booking/BookingSuccess';

export default async function BookingSuccessPage({ params }: { params: Promise<{ bookingCode: string }> }) {
    const { bookingCode } = await params;
    
    // Fetch booking data từ API trong Server Component
    let booking;
    try {
        booking = await bookingService.getBookingByCode(bookingCode);
    } catch (error) {
        console.error('Error fetching booking:', error);
        notFound();
    }

    if (!booking) {
        notFound();
    }

    return <BookingSuccess booking={booking} />;
}
