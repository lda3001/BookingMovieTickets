import React from 'react';
import { notFound } from 'next/navigation';
import { bookingService } from '@/services';
import PaymentPage from '@/components/payment/PaymentPage';

export default async function PaymentPageRoute({ params }: { params: Promise<{ bookingCode: string }> }) {
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
    

    return <PaymentPage booking={booking} />;
}
