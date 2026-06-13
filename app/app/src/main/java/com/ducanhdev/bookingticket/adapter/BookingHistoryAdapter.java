package com.ducanhdev.bookingticket.adapter;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.model.Booking;
import com.ducanhdev.bookingticket.utils.Constants;
import com.ducanhdev.bookingticket.utils.TicketQrUtils;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class BookingHistoryAdapter extends RecyclerView.Adapter<BookingHistoryAdapter.BookingViewHolder> {

    public interface OnBookingClickListener {
        void onBookingClick(Booking booking);
    }

    private final List<Booking> bookings = new ArrayList<>();
    private final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
    private final OnBookingClickListener listener;

    public BookingHistoryAdapter(OnBookingClickListener listener) {
        this.listener = listener;
    }

    public void setBookings(List<Booking> items) {
        bookings.clear();
        if (items != null) {
            bookings.addAll(items);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public BookingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_booking_history, parent, false);
        return new BookingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BookingViewHolder holder, int position) {
        holder.bind(bookings.get(position));
    }

    @Override
    public int getItemCount() {
        return bookings.size();
    }

    class BookingViewHolder extends RecyclerView.ViewHolder {
        private final TextView movieTitle;
        private final TextView statusBadge;
        private final TextView bookingCode;
        private final TextView showtime;
        private final TextView cinema;
        private final TextView seats;
        private final TextView paymentStatus;
        private final TextView totalPrice;

        BookingViewHolder(@NonNull View itemView) {
            super(itemView);
            movieTitle = itemView.findViewById(R.id.history_movie_title);
            statusBadge = itemView.findViewById(R.id.history_status_badge);
            bookingCode = itemView.findViewById(R.id.history_booking_code);
            showtime = itemView.findViewById(R.id.history_showtime);
            cinema = itemView.findViewById(R.id.history_cinema);
            seats = itemView.findViewById(R.id.history_seats);
            paymentStatus = itemView.findViewById(R.id.history_payment_status);
            totalPrice = itemView.findViewById(R.id.history_total_price);

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onBookingClick(bookings.get(position));
                }
            });
        }

        void bind(Booking booking) {
            movieTitle.setText(valueOrFallback(booking.getMovieTitle(), string(R.string.movie_fallback)));
            bookingCode.setText(string(R.string.ticket_code_format, valueOrFallback(booking.getBookingCode(), "-")));
            showtime.setText(string(R.string.showtime_format, valueOrFallback(booking.getShowTime(), "-")));
            cinema.setText(string(R.string.cinema_format, joinNonEmpty(booking.getCinemaName(), booking.getRoomName())));
            seats.setText(string(R.string.seats_format, valueOrFallback(booking.getSeatsString(), "-")));
            totalPrice.setText(currencyFormatter.format(booking.getTotalPrice()));

            if (TicketQrUtils.isPaidBooking(booking)) {
                setBadge(statusBadge, string(R.string.booking_status_paid), R.color.success, "#EAFBF1", R.color.success);
            } else {
                applyBookingStatus(statusBadge, booking.getStatus());
            }
            applyPaymentStatus(paymentStatus, booking);
        }

        private void applyBookingStatus(TextView badge, String status) {
            if (Constants.BOOKING_STATUS_CONFIRMED.equals(status)) {
                setBadge(badge, string(R.string.booking_status_confirmed), R.color.success, "#EAFBF1", R.color.success);
                return;
            }
            if (Constants.BOOKING_STATUS_COMPLETED.equals(status)) {
                setBadge(badge, string(R.string.booking_status_completed), R.color.info, "#EAF2FF", R.color.info);
                return;
            }
            if (Constants.BOOKING_STATUS_CANCELLED.equals(status)) {
                setBadge(badge, string(R.string.booking_status_cancelled), R.color.error, "#FEEEEE", R.color.error);
                return;
            }
            setBadge(badge, string(R.string.booking_status_pending), R.color.warning, "#FFF7E8", R.color.warning);
        }

        private void applyPaymentStatus(TextView badge, Booking booking) {
            if (TicketQrUtils.isPaidBooking(booking)) {
                setBadge(badge, string(R.string.booking_status_paid), R.color.success, "#EAFBF1", R.color.success);
                return;
            }
            setBadge(badge, string(R.string.booking_status_unpaid), R.color.text_hint, "#F3F5F9", R.color.text_secondary);
        }

        private void setBadge(TextView badge, String text, int strokeColorRes, String fillColor, int textColorRes) {
            GradientDrawable drawable = new GradientDrawable();
            drawable.setShape(GradientDrawable.RECTANGLE);
            drawable.setCornerRadius(dp(18));
            drawable.setColor(Color.parseColor(fillColor));
            drawable.setStroke(dp(1), ContextCompat.getColor(itemView.getContext(), strokeColorRes));
            badge.setBackground(drawable);
            badge.setText(text);
            badge.setTextColor(ContextCompat.getColor(itemView.getContext(), textColorRes));
        }

        private int dp(int value) {
            return Math.round(value * itemView.getResources().getDisplayMetrics().density);
        }

        private String joinNonEmpty(String first, String second) {
            String a = first == null ? "" : first.trim();
            String b = second == null ? "" : second.trim();
            if (!a.isEmpty() && !b.isEmpty()) return a + " - " + b;
            if (!a.isEmpty()) return a;
            if (!b.isEmpty()) return b;
            return "-";
        }

        private String valueOrFallback(String value, String fallback) {
            return value != null && !value.trim().isEmpty() ? value : fallback;
        }

        private String string(int resId, Object... args) {
            return itemView.getContext().getString(resId, args);
        }
    }
}
