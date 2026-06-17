package com.ducanhdev.bookingticket.ui.movies;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.GridLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Booking;
import com.ducanhdev.bookingticket.model.CreateBookingRequest;
import com.ducanhdev.bookingticket.model.Room;
import com.ducanhdev.bookingticket.ui.payment.PaymentActivity;
import com.ducanhdev.bookingticket.utils.Constants;
import com.google.android.material.button.MaterialButton;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SeatSelectionFragment extends Fragment {

    private static final String ARG_SHOWTIME_ID = "showtime_id";
    private static final String ARG_MOVIE_TITLE = "movie_title";
    private static final String ARG_CINEMA_NAME = "cinema_name";
    private static final String ARG_ROOM_ID = "room_id";
    private static final String ARG_ROOM_NAME = "room_name";
    private static final String ARG_SHOW_TIME = "show_time";
    private static final String ARG_PRICE = "price";

    private TextView movieTitleText;
    private TextView showtimeInfoText;
    private TextView stateText;
    private TextView selectedSeatsText;
    private TextView totalPriceText;
    private MaterialButton checkoutButton;
    private GridLayout seatGrid;

    private int showtimeId;
    private int roomId;
    private String movieTitle;
    private String cinemaName;
    private String roomName;
    private String showTime;
    private double basePrice;

    private int totalRows = 10;
    private int seatsPerRow = 8;
    private String vipRows;
    private final Set<String> bookedSeats = new HashSet<>();
    private final List<String> selectedSeats = new ArrayList<>();
    private Call<Room> roomCall;
    private Call<List<String>> bookedSeatsCall;
    private Call<Booking> bookingCall;

    public static SeatSelectionFragment newInstance(
            int showtimeId,
            String movieTitle,
            String cinemaName,
            int roomId,
            String roomName,
            String showTime,
            double price
    ) {
        SeatSelectionFragment fragment = new SeatSelectionFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_SHOWTIME_ID, showtimeId);
        args.putString(ARG_MOVIE_TITLE, movieTitle);
        args.putString(ARG_CINEMA_NAME, cinemaName);
        args.putInt(ARG_ROOM_ID, roomId);
        args.putString(ARG_ROOM_NAME, roomName);
        args.putString(ARG_SHOW_TIME, showTime);
        args.putDouble(ARG_PRICE, price);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bundle args = getArguments();
        if (args == null) return;

        showtimeId = args.getInt(ARG_SHOWTIME_ID);
        roomId = args.getInt(ARG_ROOM_ID);
        movieTitle = args.getString(ARG_MOVIE_TITLE, "");
        cinemaName = args.getString(ARG_CINEMA_NAME, "");
        roomName = args.getString(ARG_ROOM_NAME, "");
        showTime = args.getString(ARG_SHOW_TIME, "");
        basePrice = args.getDouble(ARG_PRICE, 0);
        if (basePrice <= 0) {
            basePrice = Constants.PRICE_NORMAL;
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_seat_selection, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        movieTitleText = view.findViewById(R.id.seat_movie_title);
        showtimeInfoText = view.findViewById(R.id.seat_showtime_info);
        stateText = view.findViewById(R.id.seat_state_text);
        selectedSeatsText = view.findViewById(R.id.selected_seats_text);
        totalPriceText = view.findViewById(R.id.total_price_text);
        checkoutButton = view.findViewById(R.id.btn_checkout);
        seatGrid = view.findViewById(R.id.seat_grid);

        view.findViewById(R.id.btn_close_seat).setOnClickListener(v -> closeFragment());
        checkoutButton.setOnClickListener(v -> createBooking());

        movieTitleText.setText(movieTitle);
        showtimeInfoText.setText(buildShowtimeInfo());
        renderSeats();
        updateSummary();
        loadRoom();
        loadBookedSeats();
    }

    @Override
    public void onDestroyView() {
        if (roomCall != null) roomCall.cancel();
        if (bookedSeatsCall != null) bookedSeatsCall.cancel();
        if (bookingCall != null) bookingCall.cancel();
        super.onDestroyView();
    }

    private void loadRoom() {
        if (roomId <= 0) return;

        roomCall = ApiClient.getRoomApi().getRoomById(roomId);
        roomCall.enqueue(new Callback<Room>() {
            @Override
            public void onResponse(Call<Room> call, Response<Room> response) {
                if (call.isCanceled() || !isAdded()) return;

                if (response.isSuccessful() && response.body() != null) {
                    Room room = response.body();
                    if (room.getTotalRows() > 0) totalRows = room.getTotalRows();
                    if (room.getSeatsPerRow() > 0) seatsPerRow = room.getSeatsPerRow();
                    vipRows = room.getVipRows();
                    if (roomName == null || roomName.isEmpty()) {
                        roomName = room.getName();
                        showtimeInfoText.setText(buildShowtimeInfo());
                    }
                    renderSeats();
                }
            }

            @Override
            public void onFailure(Call<Room> call, Throwable t) {
                if (call.isCanceled() || !isAdded()) return;
                showState(getString(R.string.room_map_fallback));
            }
        });
    }

    private void loadBookedSeats() {
        if (showtimeId <= 0) return;

        showState(getString(R.string.booked_seats_loading));
        bookedSeatsCall = ApiClient.getShowtimeApi().getBookedSeats(showtimeId);
        bookedSeatsCall.enqueue(new Callback<List<String>>() {
            @Override
            public void onResponse(Call<List<String>> call, Response<List<String>> response) {
                if (call.isCanceled() || !isAdded()) return;

                stateText.setVisibility(View.GONE);
                bookedSeats.clear();
                if (response.isSuccessful() && response.body() != null) {
                    bookedSeats.addAll(response.body());
                } else {
                    showState(getString(R.string.booked_seats_load_error));
                }
                selectedSeats.removeAll(bookedSeats);
                renderSeats();
                updateSummary();
            }

            @Override
            public void onFailure(Call<List<String>> call, Throwable t) {
                if (call.isCanceled() || !isAdded()) return;
                showState(getString(R.string.booked_seats_load_error_format, t.getMessage()));
            }
        });
    }

    private void renderSeats() {
        seatGrid.removeAllViews();
        seatGrid.setColumnCount(seatsPerRow + 1);

        addAxisLabel("");
        for (int seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
            addAxisLabel(String.valueOf(seatNumber));
        }

        for (int rowIndex = 0; rowIndex < totalRows; rowIndex++) {
            String rowLabel = rowLabel(rowIndex);
            addAxisLabel(rowLabel);
            for (int seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
                String seatCode = rowLabel + seatNumber;
                addSeat(seatCode, isVipRow(rowLabel));
            }
        }
    }

    private void addAxisLabel(String text) {
        TextView label = new TextView(requireContext());
        label.setText(text);
        label.setGravity(android.view.Gravity.CENTER);
        label.setTextColor(ContextCompat.getColor(requireContext(), R.color.text_hint));
        label.setTextSize(11);

        GridLayout.LayoutParams params = new GridLayout.LayoutParams();
        params.width = dpToPx(30);
        params.height = dpToPx(28);
        params.setMargins(dpToPx(2), dpToPx(2), dpToPx(2), dpToPx(2));
        label.setLayoutParams(params);
        seatGrid.addView(label);
    }

    private void addSeat(String seatCode, boolean vip) {
        boolean booked = bookedSeats.contains(seatCode);
        boolean selected = selectedSeats.contains(seatCode);

        TextView seat = new TextView(requireContext());
        seat.setText(seatCode);
        seat.setGravity(android.view.Gravity.CENTER);
        seat.setTextSize(10);
        seat.setTextColor(ContextCompat.getColor(requireContext(), booked ? R.color.text_hint : R.color.white));
        seat.setBackgroundResource(getSeatBackground(booked, selected, vip));
        seat.setEnabled(!booked);
        seat.setAlpha(booked ? 0.7f : 1f);
        seat.setOnClickListener(v -> toggleSeat(seatCode));

        GridLayout.LayoutParams params = new GridLayout.LayoutParams();
        params.width = dpToPx(34);
        params.height = dpToPx(30);
        params.setMargins(dpToPx(3), dpToPx(3), dpToPx(3), dpToPx(3));
        seat.setLayoutParams(params);
        seatGrid.addView(seat);
    }

    private int getSeatBackground(boolean booked, boolean selected, boolean vip) {
        if (booked) return R.drawable.bg_seat_booked;
        if (selected) return R.drawable.bg_seat_selected;
        if (vip) return R.drawable.bg_seat_vip;
        return R.drawable.bg_seat_available;
    }

    private void toggleSeat(String seatCode) {
        if (bookedSeats.contains(seatCode)) return;

        if (selectedSeats.contains(seatCode)) {
            selectedSeats.remove(seatCode);
        } else {
            selectedSeats.add(seatCode);
        }
        renderSeats();
        updateSummary();
    }

    private void updateSummary() {
        if (selectedSeats.isEmpty()) {
            selectedSeatsText.setText(R.string.seat_none_selected);
            checkoutButton.setEnabled(false);
        } else {
            selectedSeatsText.setText(getString(R.string.seat_selected_format, String.join(", ", selectedSeats)));
            checkoutButton.setEnabled(true);
        }
        totalPriceText.setText(formatCurrency(calculateTotal()));
    }

    private double calculateTotal() {
        double total = 0;
        for (String seatCode : selectedSeats) {
            String row = seatCode.replaceAll("\\d", "");
            total += isVipRow(row) ? basePrice * Constants.PRICE_VIP_MULTIPLIER : basePrice;
        }
        return total;
    }

    private void createBooking() {
        if (selectedSeats.isEmpty()) {
            Toast.makeText(requireContext(), getString(R.string.select_seat_required), Toast.LENGTH_SHORT).show();
            return;
        }

        checkoutButton.setEnabled(false);
        checkoutButton.setText(R.string.processing);
        bookingCall = ApiClient.getBookingApi().createBooking(new CreateBookingRequest(showtimeId, new ArrayList<>(selectedSeats)));
        bookingCall.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                if (call.isCanceled() || !isAdded()) return;

                checkoutButton.setText(R.string.checkout);
                checkoutButton.setEnabled(true);
                if (response.isSuccessful() && response.body() != null) {
                    Booking booking = response.body();
                    String code = booking.getBookingCode() != null ? booking.getBookingCode() : String.valueOf(booking.getId());
                    Toast.makeText(requireContext(), getString(R.string.booking_success_format, code), Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(requireContext(), PaymentActivity.class);
                    intent.putExtra(Constants.EXTRA_BOOKING_CODE, code);
                    startActivity(intent);
                    closeFragment();
                } else if (response.code() == 401 || response.code() == 403) {
                    Toast.makeText(requireContext(), getString(R.string.booking_login_required), Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(requireContext(), getString(R.string.booking_create_error), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                if (call.isCanceled() || !isAdded()) return;

                checkoutButton.setText(R.string.checkout);
                checkoutButton.setEnabled(true);
                Toast.makeText(requireContext(), getString(R.string.booking_create_error_format, t.getMessage()), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private boolean isVipRow(String rowLabel) {
        if (rowLabel == null || rowLabel.isEmpty()) return false;
        if (vipRows != null && !vipRows.trim().isEmpty()) {
            String normalized = vipRows
                    .replace("[", "")
                    .replace("]", "")
                    .replace("\"", "")
                    .replace("'", "")
                    .replace(" ", "")
                    .toUpperCase(Locale.US);
            int rowNumber = rowLabel.toUpperCase(Locale.US).charAt(0) - 'A' + 1;
            for (String row : normalized.split(",")) {
                if (rowLabel.equalsIgnoreCase(row) || isSameNumericRow(row, rowNumber)) return true;
            }
            return false;
        }

        int rowIndex = rowLabel.toUpperCase(Locale.US).charAt(0) - 'A';
        return rowIndex >= Math.max(0, totalRows - 2);
    }

    private boolean isSameNumericRow(String row, int rowNumber) {
        try {
            return Integer.parseInt(row) == rowNumber;
        } catch (NumberFormatException ignored) {
            return false;
        }
    }

    private String rowLabel(int rowIndex) {
        return String.valueOf((char) ('A' + rowIndex));
    }

    private String buildShowtimeInfo() {
        List<String> parts = new ArrayList<>();
        if (cinemaName != null && !cinemaName.isEmpty()) parts.add(cinemaName);
        if (roomName != null && !roomName.isEmpty()) parts.add(roomName);
        if (showTime != null && !showTime.isEmpty()) parts.add(showTime);
        return String.join(" - ", parts);
    }

    private String formatCurrency(double value) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(value);
    }

    private void showState(String message) {
        stateText.setText(message);
        stateText.setVisibility(View.VISIBLE);
    }

    private void closeFragment() {
        getParentFragmentManager().popBackStack();
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
