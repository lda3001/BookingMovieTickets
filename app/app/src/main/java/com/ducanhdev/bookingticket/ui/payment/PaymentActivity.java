package com.ducanhdev.bookingticket.ui.payment;

import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Booking;
import com.ducanhdev.bookingticket.utils.Constants;
import com.ducanhdev.bookingticket.utils.LanguageManager;
import com.ducanhdev.bookingticket.utils.TicketQrUtils;
import com.google.android.material.button.MaterialButton;

import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PaymentActivity extends AppCompatActivity {
    private static final long PAYMENT_WINDOW_MS = 10 * 60 * 1000L;
    private static final long PAYMENT_STATUS_POLL_MS = 5000L;

    private TextView bookingCodeText;
    private TextView statusBadge;
    private TextView timerText;
    private TextView movieText;
    private TextView cinemaText;
    private TextView showtimeText;
    private TextView createdAtText;
    private TextView seatsText;
    private TextView totalText;
    private TextView stateText;
    private TextView qrTitleText;
    private TextView qrCaptionText;
    private ImageView qrImage;
    private LinearLayout qrPanel;
    private ProgressBar progressBar;
    private MaterialButton confirmButton;
    private MaterialButton cancelButton;

    private String bookingCode;
    private Booking currentBooking;
    private CountDownTimer countDownTimer;
    private final Handler paymentStatusHandler = new Handler(Looper.getMainLooper());
    private final Runnable paymentStatusPoller = new Runnable() {
        @Override
        public void run() {
            refreshBooking(false);
            paymentStatusHandler.postDelayed(this, PAYMENT_STATUS_POLL_MS);
        }
    };
    private Call<Booking> bookingCall;
    private Call<Void> cancelCall;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        LanguageManager.applySavedLanguage(this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);

        ApiClient.init(this);
        bookingCode = getIntent().getStringExtra(Constants.EXTRA_BOOKING_CODE);

        initViews();
        if (bookingCode == null || bookingCode.isEmpty()) {
            showState(getString(R.string.booking_code_missing));
            setButtonsEnabled(false);
            return;
        }

        loadBooking();
    }

    @Override
    protected void onDestroy() {
        if (countDownTimer != null) countDownTimer.cancel();
        stopPaymentStatusPolling();
        if (bookingCall != null) bookingCall.cancel();
        if (cancelCall != null) cancelCall.cancel();
        super.onDestroy();
    }

    private void initViews() {
        findViewById(R.id.btn_back_payment).setOnClickListener(v -> finish());
        bookingCodeText = findViewById(R.id.payment_booking_code);
        statusBadge = findViewById(R.id.payment_status_badge);
        timerText = findViewById(R.id.payment_timer);
        movieText = findViewById(R.id.payment_movie);
        cinemaText = findViewById(R.id.payment_cinema);
        showtimeText = findViewById(R.id.payment_showtime);
        createdAtText = findViewById(R.id.payment_created_at);
        seatsText = findViewById(R.id.payment_seats);
        totalText = findViewById(R.id.payment_total);
        stateText = findViewById(R.id.payment_state_text);
        qrTitleText = findViewById(R.id.payment_qr_title);
        qrCaptionText = findViewById(R.id.payment_qr_caption);
        qrImage = findViewById(R.id.payment_qr_image);
        qrPanel = findViewById(R.id.payment_qr_panel);
        progressBar = findViewById(R.id.payment_progress);
        confirmButton = findViewById(R.id.btn_confirm_payment);
        cancelButton = findViewById(R.id.btn_cancel_payment);

        cancelButton.setOnClickListener(v -> cancelBooking(getString(R.string.payment_cancel_success)));
    }

    private void loadBooking() {
        setLoading(true);
        bookingCall = ApiClient.getBookingApi().getBookingByCode(bookingCode);
        bookingCall.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                if (call.isCanceled()) return;
                setLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    currentBooking = response.body();
                    bindBooking(currentBooking);
                    return;
                }

                showState(getString(R.string.payment_load_error));
                setButtonsEnabled(false);
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                if (call.isCanceled()) return;
                setLoading(false);
                showState(getString(R.string.connection_error_format, t.getMessage()));
                setButtonsEnabled(false);
            }
        });
    }

    private void refreshBooking(boolean showLoading) {
        if (showLoading) {
            setLoading(true);
        }
        if (bookingCall != null) {
            bookingCall.cancel();
        }

        bookingCall = ApiClient.getBookingApi().getBookingByCode(bookingCode);
        bookingCall.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                if (call.isCanceled()) return;
                if (showLoading) {
                    setLoading(false);
                }

                if (response.isSuccessful() && response.body() != null) {
                    currentBooking = response.body();
                    bindBooking(currentBooking);
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                if (call.isCanceled()) return;
                if (showLoading) {
                    setLoading(false);
                    showState(getString(R.string.connection_error_format, t.getMessage()));
                    setButtonsEnabled(false);
                }
            }
        });
    }

    private void bindBooking(Booking booking) {
        String code = valueOrDash(booking.getBookingCode());
        bookingCodeText.setText(getString(R.string.booking_code_format, code));
        movieText.setText(valueOrDash(booking.getMovieTitle()));
        cinemaText.setText(getString(R.string.cinema_format, joinNonEmpty(booking.getCinemaName(), booking.getRoomName())));
        showtimeText.setText(getString(R.string.showtime_format, valueOrDash(booking.getShowTime())));
        createdAtText.setText(getString(R.string.booked_at_format, valueOrDash(booking.getCreatedAt())));
        seatsText.setText(getString(R.string.seats_format, valueOrDash(booking.getSeatsString())));
        totalText.setText(formatCurrency(booking.getTotalPrice()));

        updateStatusUi(booking);
        if (TicketQrUtils.isPaidBooking(booking)) {
            showTicketQr(booking);
        } else if (isPending(booking)) {
            showPaymentQr(booking);
            startCountdown(booking);
            startPaymentStatusPolling();
        }
    }

    private void updateStatusUi(Booking booking) {
        String status = booking.getStatus();
        statusBadge.setText(TicketQrUtils.isPaidBooking(booking) ? getString(R.string.booking_status_paid) : statusText(status));

        boolean paid = TicketQrUtils.isPaidBooking(booking);
        boolean pending = isPending(booking) && !paid;
        qrPanel.setVisibility(pending || paid ? View.VISIBLE : View.GONE);
        cancelButton.setVisibility(pending ? View.VISIBLE : View.GONE);
        timerText.setVisibility(pending ? View.VISIBLE : View.GONE);

        if (pending) {
            showState(getString(R.string.payment_pending_auto));
            confirmButton.setVisibility(View.GONE);
            cancelButton.setEnabled(true);
            return;
        }

        if (countDownTimer != null) countDownTimer.cancel();
        stopPaymentStatusPolling();
        confirmButton.setVisibility(View.VISIBLE);
        confirmButton.setEnabled(true);
        confirmButton.setText(R.string.done);
        confirmButton.setOnClickListener(v -> finish());

        if (Constants.BOOKING_STATUS_CANCELLED.equals(status)) {
            showState(getString(R.string.payment_cancelled_state));
        } else if (paid) {
            showState(getString(R.string.payment_ticket_paid_state));
        } else {
            showState(getString(R.string.payment_confirmed_state));
        }
    }

    private void showPaymentQr(Booking booking) {
        qrTitleText.setText(R.string.payment_qr_payment_title);
        qrImage.setContentDescription(getString(R.string.payment_qr_payment_title));
        qrCaptionText.setText(R.string.payment_qr_payment_caption);
        Glide.with(this)
                .load(buildPaymentQrUrl(booking))
                .fitCenter()
                .into(qrImage);
    }

    private void showTicketQr(Booking booking) {
        qrTitleText.setText(R.string.payment_qr_ticket_title);
        qrImage.setContentDescription(getString(R.string.payment_qr_ticket_title));
        qrCaptionText.setText(R.string.payment_qr_ticket_caption);
        Glide.with(this)
                .load(TicketQrUtils.buildTicketQrUrl(booking))
                .fitCenter()
                .into(qrImage);
    }

    private void startCountdown(Booking booking) {
        if (countDownTimer != null) countDownTimer.cancel();

        long remainingMs = getRemainingPaymentMs(booking);
        if (remainingMs <= 0) {
            timerText.setText(R.string.payment_timeout);
            cancelBooking(getString(R.string.payment_cancel_expired));
            return;
        }

        countDownTimer = new CountDownTimer(remainingMs, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                long totalSeconds = millisUntilFinished / 1000;
                long minutes = totalSeconds / 60;
                long seconds = totalSeconds % 60;
                timerText.setText(getString(R.string.payment_time_remaining_format, minutes, seconds));
            }

            @Override
            public void onFinish() {
                timerText.setText(R.string.payment_timeout);
                refreshBooking(false);
                if (currentBooking != null && isPending(currentBooking) && !TicketQrUtils.isPaidBooking(currentBooking)) {
                    cancelBooking(getString(R.string.payment_cancel_expired));
                }
            }
        };
        countDownTimer.start();
    }

    private void cancelBooking(String successMessage) {
        if (currentBooking == null || !isPending(currentBooking) || TicketQrUtils.isPaidBooking(currentBooking)) return;

        setLoading(true);
        setButtonsEnabled(false);
        cancelCall = ApiClient.getBookingApi().cancelBooking(currentBooking.getBookingCode());
        cancelCall.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (call.isCanceled()) return;
                setLoading(false);

                if (response.isSuccessful()) {
                    currentBooking.setStatus(Constants.BOOKING_STATUS_CANCELLED);
                    bindBooking(currentBooking);
                    Toast.makeText(PaymentActivity.this, successMessage, Toast.LENGTH_SHORT).show();
                    return;
                }

                setButtonsEnabled(true);
                showState(getString(R.string.payment_cancel_failed));
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                if (call.isCanceled()) return;
                setLoading(false);
                setButtonsEnabled(true);
                showState(getString(R.string.payment_cancel_error_format, t.getMessage()));
            }
        });
    }

    private String buildPaymentQrUrl(Booking booking) {
        return Uri.parse("https://img.vietqr.io/image/MBBank-3018686868686-qr_only.png")
                .buildUpon()
                .appendQueryParameter("amount", String.valueOf(Math.round(booking.getTotalPrice())))
                .appendQueryParameter("addInfo", booking.getBookingCode())
                .appendQueryParameter("accountName", "LE DUC ANH")
                .build()
                .toString();
    }

    private long getRemainingPaymentMs(Booking booking) {
        long createdAtMs = parseCreatedAtMs(booking);
        if (createdAtMs <= 0) return PAYMENT_WINDOW_MS;

        long elapsedMs = System.currentTimeMillis() - createdAtMs;
        return Math.max(PAYMENT_WINDOW_MS - elapsedMs, 0);
    }

    private long parseCreatedAtMs(Booking booking) {
        String createdAt = booking.getCreatedAt();
        if (createdAt != null && !createdAt.isEmpty()) {
            try {
                Date parsed = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.US).parse(createdAt);
                if (parsed != null) return parsed.getTime();
            } catch (ParseException ignored) {
                // Fall back to booking code timestamp below.
            }
        }

        String code = booking.getBookingCode();
        if (code != null && code.startsWith("GC")) {
            try {
                return Long.parseLong(code.substring(2));
            } catch (NumberFormatException ignored) {
                return 0;
            }
        }

        return 0;
    }

    private boolean isPending(Booking booking) {
        return booking != null && Constants.BOOKING_STATUS_PENDING.equals(booking.getStatus());
    }

    private void startPaymentStatusPolling() {
        paymentStatusHandler.removeCallbacks(paymentStatusPoller);
        paymentStatusHandler.postDelayed(paymentStatusPoller, PAYMENT_STATUS_POLL_MS);
    }

    private void stopPaymentStatusPolling() {
        paymentStatusHandler.removeCallbacks(paymentStatusPoller);
    }

    private String statusText(String status) {
        if (Constants.BOOKING_STATUS_CONFIRMED.equals(status)) return getString(R.string.booking_status_confirmed);
        if (Constants.BOOKING_STATUS_COMPLETED.equals(status)) return getString(R.string.booking_status_completed);
        if (Constants.BOOKING_STATUS_CANCELLED.equals(status)) return getString(R.string.booking_status_cancelled);
        return getString(R.string.booking_status_pending);
    }

    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
    }

    private void setButtonsEnabled(boolean enabled) {
        confirmButton.setEnabled(enabled);
        cancelButton.setEnabled(enabled);
    }

    private void showState(String message) {
        stateText.setText(message);
        stateText.setVisibility(View.VISIBLE);
    }

    private String formatCurrency(double value) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(value);
    }

    private String joinNonEmpty(String first, String second) {
        String a = first == null ? "" : first.trim();
        String b = second == null ? "" : second.trim();
        if (!a.isEmpty() && !b.isEmpty()) return a + " - " + b;
        if (!a.isEmpty()) return a;
        if (!b.isEmpty()) return b;
        return "-";
    }

    private String valueOrDash(String value) {
        return value == null || value.trim().isEmpty() ? "-" : value;
    }
}
