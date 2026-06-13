package com.ducanhdev.bookingticket.ui.account;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.adapter.BookingHistoryAdapter;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Booking;
import com.ducanhdev.bookingticket.ui.auth.LoginActivity;
import com.ducanhdev.bookingticket.ui.payment.PaymentActivity;
import com.ducanhdev.bookingticket.utils.Constants;
import com.ducanhdev.bookingticket.utils.LanguageManager;
import com.ducanhdev.bookingticket.utils.SessionManager;
import com.ducanhdev.bookingticket.utils.TicketQrUtils;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookingHistoryActivity extends AppCompatActivity {
    private static final int FILTER_ALL = 0;
    private static final int FILTER_PENDING = 1;
    private static final int FILTER_PAID = 2;
    private static final int FILTER_CANCELLED = 3;

    private SwipeRefreshLayout refreshLayout;
    private RecyclerView bookingList;
    private TextView stateText;
    private ProgressBar progressBar;
    private TextView filterAll;
    private TextView filterPending;
    private TextView filterPaid;
    private TextView filterCancelled;
    private EditText searchInput;
    private BookingHistoryAdapter adapter;
    private SessionManager sessionManager;
    private Call<List<Booking>> bookingsCall;
    private final List<Booking> allBookings = new ArrayList<>();
    private int selectedFilter = FILTER_ALL;
    private String searchQuery = "";
    private boolean hasLoadedOnce;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        LanguageManager.applySavedLanguage(this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_booking_history);

        ApiClient.init(this);
        sessionManager = new SessionManager(this);
        initViews();
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadBookings(!hasLoadedOnce);
    }

    @Override
    protected void onDestroy() {
        if (bookingsCall != null) bookingsCall.cancel();
        super.onDestroy();
    }

    private void initViews() {
        findViewById(R.id.btn_back_booking_history).setOnClickListener(v -> finish());
        refreshLayout = findViewById(R.id.booking_history_refresh);
        bookingList = findViewById(R.id.booking_history_list);
        stateText = findViewById(R.id.booking_history_state);
        progressBar = findViewById(R.id.booking_history_progress);
        filterAll = findViewById(R.id.filter_all);
        filterPending = findViewById(R.id.filter_pending);
        filterPaid = findViewById(R.id.filter_paid);
        filterCancelled = findViewById(R.id.filter_cancelled);
        searchInput = findViewById(R.id.booking_history_search);

        adapter = new BookingHistoryAdapter(this::openBookingDetail);
        bookingList.setLayoutManager(new LinearLayoutManager(this));
        bookingList.setAdapter(adapter);
        refreshLayout.setOnRefreshListener(() -> loadBookings(false));
        setupFilters();
        setupSearch();
    }

    private void setupFilters() {
        filterAll.setOnClickListener(v -> selectFilter(FILTER_ALL));
        filterPending.setOnClickListener(v -> selectFilter(FILTER_PENDING));
        filterPaid.setOnClickListener(v -> selectFilter(FILTER_PAID));
        filterCancelled.setOnClickListener(v -> selectFilter(FILTER_CANCELLED));
        updateFilterUi();
    }

    private void selectFilter(int filter) {
        if (selectedFilter == filter) return;
        selectedFilter = filter;
        updateFilterUi();
        applyFilter();
    }

    private void setupSearch() {
        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchQuery = s == null ? "" : s.toString().trim();
                applyFilter();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    private void loadBookings(boolean showInitialLoading) {
        if (!hasAuthSession()) {
            redirectToLogin(getString(R.string.booking_history_login_required), false);
            return;
        }

        if (bookingsCall != null) {
            bookingsCall.cancel();
        }

        setLoading(showInitialLoading);
        if (!showInitialLoading) {
            refreshLayout.setRefreshing(true);
        }

        bookingsCall = ApiClient.getBookingApi().getUserBookings();
        bookingsCall.enqueue(new Callback<List<Booking>>() {
            @Override
            public void onResponse(Call<List<Booking>> call, Response<List<Booking>> response) {
                if (call.isCanceled()) return;
                hasLoadedOnce = true;
                setLoading(false);
                refreshLayout.setRefreshing(false);

                if (response.isSuccessful()) {
                    List<Booking> bookings = response.body() == null
                            ? new ArrayList<>()
                            : new ArrayList<>(response.body());
                    Collections.sort(bookings, (left, right) -> Integer.compare(right.getId(), left.getId()));
                    allBookings.clear();
                    allBookings.addAll(bookings);
                    applyFilter();
                    return;
                }

                if (response.code() == 401 || response.code() == 403) {
                    redirectToLogin(getString(R.string.session_expired_login_again), true);
                    return;
                }

                showState(getString(R.string.booking_history_load_error));
            }

            @Override
            public void onFailure(Call<List<Booking>> call, Throwable t) {
                if (call.isCanceled()) return;
                hasLoadedOnce = true;
                setLoading(false);
                refreshLayout.setRefreshing(false);
                showState(getString(R.string.connection_error_format, t.getMessage()));
            }
        });
    }

    private void openBookingDetail(Booking booking) {
        String bookingCode = booking.getBookingCode();
        if (bookingCode == null || bookingCode.trim().isEmpty()) {
            Toast.makeText(this, getString(R.string.booking_code_missing), Toast.LENGTH_SHORT).show();
            return;
        }

        Intent intent = new Intent(this, PaymentActivity.class);
        intent.putExtra(Constants.EXTRA_BOOKING_CODE, bookingCode);
        startActivity(intent);
    }

    private void applyFilter() {
        List<Booking> filteredBookings = new ArrayList<>();
        for (Booking booking : allBookings) {
            if (matchesSelectedFilter(booking)) {
                filteredBookings.add(booking);
            }
        }

        adapter.setBookings(filteredBookings);
        updateContentState(allBookings.isEmpty(), filteredBookings.isEmpty());
    }

    private boolean matchesSelectedFilter(Booking booking) {
        if (!matchesSearchQuery(booking)) {
            return false;
        }

        if (selectedFilter == FILTER_PENDING) {
            return Constants.BOOKING_STATUS_PENDING.equals(booking.getStatus())
                    && !TicketQrUtils.isPaidBooking(booking);
        }
        if (selectedFilter == FILTER_PAID) {
            return TicketQrUtils.isPaidBooking(booking);
        }
        if (selectedFilter == FILTER_CANCELLED) {
            return Constants.BOOKING_STATUS_CANCELLED.equals(booking.getStatus());
        }
        return true;
    }

    private boolean matchesSearchQuery(Booking booking) {
        if (searchQuery.isEmpty()) {
            return true;
        }

        String query = normalizeSearchText(searchQuery);
        String searchableText = normalizeSearchText(
                joinSearchParts(
                        booking.getBookingCode(),
                        booking.getMovieTitle(),
                        booking.getCinemaName(),
                        booking.getRoomName(),
                        booking.getSeatsString(),
                        booking.getShowTime(),
                        booking.getCreatedAt(),
                        String.valueOf(Math.round(booking.getTotalPrice())),
                        booking.getStatus(),
                        TicketQrUtils.isPaidBooking(booking) ? "da thanh toan paid" : "",
                        Constants.BOOKING_STATUS_PENDING.equals(booking.getStatus()) ? "cho thanh toan pending" : "",
                        Constants.BOOKING_STATUS_CANCELLED.equals(booking.getStatus()) ? "da huy cancelled" : ""
                )
        );
        return searchableText.contains(query);
    }

    private String joinSearchParts(String... parts) {
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (part != null && !part.trim().isEmpty()) {
                if (builder.length() > 0) {
                    builder.append(' ');
                }
                builder.append(part);
            }
        }
        return builder.toString();
    }

    private String normalizeSearchText(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return normalized
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replace('\u0111', 'd')
                .replace('\u0110', 'd')
                .toLowerCase(Locale.ROOT);
    }

    private void updateFilterUi() {
        updateFilterChip(filterAll, selectedFilter == FILTER_ALL);
        updateFilterChip(filterPending, selectedFilter == FILTER_PENDING);
        updateFilterChip(filterPaid, selectedFilter == FILTER_PAID);
        updateFilterChip(filterCancelled, selectedFilter == FILTER_CANCELLED);
    }

    private void updateFilterChip(TextView chip, boolean selected) {
        chip.setBackgroundResource(selected ? R.drawable.bg_primary_chip : R.drawable.bg_chip);
        chip.setTextColor(ContextCompat.getColor(
                this,
                selected ? R.color.primary_light : R.color.text_secondary
        ));
    }

    private boolean hasAuthSession() {
        String token = sessionManager.getToken();
        return sessionManager.isLoggedIn() && token != null && !token.trim().isEmpty();
    }

    private void redirectToLogin(String message, boolean clearSession) {
        setLoading(false);
        refreshLayout.setRefreshing(false);
        if (clearSession) {
            sessionManager.logout();
            ApiClient.resetClient();
        }
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }

    private void updateContentState(boolean allEmpty, boolean filteredEmpty) {
        bookingList.setVisibility(filteredEmpty ? View.GONE : View.VISIBLE);
        stateText.setVisibility(filteredEmpty ? View.VISIBLE : View.GONE);
        if (allEmpty) {
            stateText.setText(R.string.booking_history_empty);
        } else if (!searchQuery.isEmpty()) {
            stateText.setText(R.string.booking_history_no_search);
        } else {
            stateText.setText(R.string.booking_history_no_filter);
        }
    }

    private void showState(String message) {
        allBookings.clear();
        adapter.setBookings(null);
        bookingList.setVisibility(View.GONE);
        stateText.setText(message);
        stateText.setVisibility(View.VISIBLE);
    }

    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        if (loading) {
            stateText.setVisibility(View.GONE);
        }
    }
}
