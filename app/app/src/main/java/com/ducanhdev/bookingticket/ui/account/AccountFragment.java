package com.ducanhdev.bookingticket.ui.account;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Booking;
import com.ducanhdev.bookingticket.ui.auth.LoginActivity;
import com.ducanhdev.bookingticket.utils.Constants;
import com.ducanhdev.bookingticket.utils.LanguageManager;
import com.ducanhdev.bookingticket.utils.SessionManager;
import com.ducanhdev.bookingticket.utils.ThemeManager;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.switchmaterial.SwitchMaterial;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AccountFragment extends Fragment {

    private LinearLayout notLoggedInLayout;
    private ScrollView loggedInLayout;
    private MaterialButton btnLogin;
    private MaterialButton btnLogout;
    private TextView userName;
    private TextView userEmail;
    private TextView bookingsStat;
    private TextView themeLabel;
    private SwitchMaterial themeSwitch;
    private TextView guestThemeLabel;
    private SwitchMaterial guestThemeSwitch;
    private TextView languageVi;
    private TextView languageEn;
    private TextView guestLanguageVi;
    private TextView guestLanguageEn;
    private LinearLayout menuProfile;
    private LinearLayout menuTransactions;

    private SessionManager sessionManager;
    private Call<List<Booking>> bookingsCall;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_account, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        ApiClient.init(requireContext());
        sessionManager = new SessionManager(requireContext());
        initViews(view);
        setupClickListeners();
    }

    @Override
    public void onResume() {
        super.onResume();
        updateUI();
    }

    @Override
    public void onDestroyView() {
        cancelBookingsCall();
        super.onDestroyView();
    }

    private void initViews(View view) {
        notLoggedInLayout = view.findViewById(R.id.not_logged_in_layout);
        loggedInLayout = view.findViewById(R.id.logged_in_layout);
        btnLogin = view.findViewById(R.id.btn_login);
        btnLogout = view.findViewById(R.id.btn_logout);
        userName = view.findViewById(R.id.user_name);
        userEmail = view.findViewById(R.id.user_email);
        bookingsStat = view.findViewById(R.id.account_bookings_stat);
        themeLabel = view.findViewById(R.id.theme_label);
        themeSwitch = view.findViewById(R.id.theme_switch);
        guestThemeLabel = view.findViewById(R.id.guest_theme_label);
        guestThemeSwitch = view.findViewById(R.id.guest_theme_switch);
        languageVi = view.findViewById(R.id.language_vi);
        languageEn = view.findViewById(R.id.language_en);
        guestLanguageVi = view.findViewById(R.id.guest_language_vi);
        guestLanguageEn = view.findViewById(R.id.guest_language_en);
        menuProfile = view.findViewById(R.id.menu_profile);
        menuTransactions = view.findViewById(R.id.menu_transactions);
    }

    private void setupClickListeners() {
        btnLogin.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), LoginActivity.class);
            startActivity(intent);
        });

        btnLogout.setOnClickListener(v -> {
            sessionManager.logout();
            updateUI();
        });

        boolean isDarkMode = ThemeManager.isDarkMode(requireContext());
        themeSwitch.setChecked(isDarkMode);
        guestThemeSwitch.setChecked(isDarkMode);
        updateThemeLabel(isDarkMode);

        themeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (!buttonView.isPressed()) return;
            updateThemeLabel(isChecked);
            ThemeManager.setDarkMode(requireContext(), isChecked);
        });
        guestThemeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (!buttonView.isPressed()) return;
            updateThemeLabel(isChecked);
            ThemeManager.setDarkMode(requireContext(), isChecked);
        });
        setupLanguageControls();

        menuProfile.setOnClickListener(v -> {
            // TODO: Open profile activity
        });

        menuTransactions.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), BookingHistoryActivity.class);
            startActivity(intent);
        });
    }

    private void updateUI() {
        if (sessionManager.isLoggedIn() && hasAuthToken()) {
            notLoggedInLayout.setVisibility(View.GONE);
            loggedInLayout.setVisibility(View.VISIBLE);

            String fullName = sessionManager.getFullName();
            String email = sessionManager.getEmail();

            userName.setText(fullName != null && !fullName.isEmpty() ? fullName : getString(R.string.user_fallback));
            userEmail.setText(email != null ? email : "");
            loadBookingCount();
        } else {
            cancelBookingsCall();
            setBookingCount(0);
            notLoggedInLayout.setVisibility(View.VISIBLE);
            loggedInLayout.setVisibility(View.GONE);
        }
        updateLanguageSelection();
    }

    private void loadBookingCount() {
        setBookingCount(0);
        cancelBookingsCall();

        bookingsCall = ApiClient.getBookingApi().getUserBookings();
        bookingsCall.enqueue(new Callback<List<Booking>>() {
            @Override
            public void onResponse(Call<List<Booking>> call, Response<List<Booking>> response) {
                if (call.isCanceled() || !isAdded()) return;

                if (response.isSuccessful()) {
                    setBookingCount(countBookedTickets(response.body()));
                }
            }

            @Override
            public void onFailure(Call<List<Booking>> call, Throwable t) {
                if (call.isCanceled() || !isAdded()) return;
                setBookingCount(0);
            }
        });
    }

    private int countBookedTickets(List<Booking> bookings) {
        if (bookings == null || bookings.isEmpty()) {
            return 0;
        }

        int count = 0;
        for (Booking booking : bookings) {
            if (Constants.BOOKING_STATUS_CANCELLED.equals(booking.getStatus())) {
                continue;
            }

            List<String> seatCodes = booking.getSeatCodes();
            count += seatCodes == null || seatCodes.isEmpty() ? 1 : seatCodes.size();
        }
        return count;
    }

    private void setBookingCount(int count) {
        if (bookingsStat != null) {
            bookingsStat.setText(getString(R.string.account_bookings_stat_format, Math.max(0, count)));
        }
    }

    private void cancelBookingsCall() {
        if (bookingsCall != null) {
            bookingsCall.cancel();
            bookingsCall = null;
        }
    }

    private void updateThemeLabel(boolean isDarkMode) {
        String label = getString(isDarkMode ? R.string.dark_mode : R.string.light_mode);
        themeLabel.setText(label);
        guestThemeLabel.setText(label);
    }

    private void setupLanguageControls() {
        languageVi.setOnClickListener(v -> setLanguage(LanguageManager.LANGUAGE_VI));
        guestLanguageVi.setOnClickListener(v -> setLanguage(LanguageManager.LANGUAGE_VI));
        languageEn.setOnClickListener(v -> setLanguage(LanguageManager.LANGUAGE_EN));
        guestLanguageEn.setOnClickListener(v -> setLanguage(LanguageManager.LANGUAGE_EN));
        updateLanguageSelection();
    }

    private void setLanguage(String language) {
        LanguageManager.setLanguage(requireContext(), language);
        updateLanguageSelection();
    }

    private void updateLanguageSelection() {
        String selectedLanguage = LanguageManager.getLanguage(requireContext());
        boolean isVietnamese = LanguageManager.LANGUAGE_VI.equals(selectedLanguage);
        updateLanguageChip(languageVi, isVietnamese);
        updateLanguageChip(guestLanguageVi, isVietnamese);
        updateLanguageChip(languageEn, !isVietnamese);
        updateLanguageChip(guestLanguageEn, !isVietnamese);
    }

    private void updateLanguageChip(TextView chip, boolean selected) {
        chip.setBackgroundResource(selected ? R.drawable.bg_primary_chip : R.drawable.bg_chip);
        chip.setTextColor(ContextCompat.getColor(
                requireContext(),
                selected ? R.color.primary_light : R.color.text_secondary
        ));
        chip.setTypeface(null, selected ? Typeface.BOLD : Typeface.NORMAL);
    }

    private boolean hasAuthToken() {
        String token = sessionManager.getToken();
        return token != null && !token.trim().isEmpty();
    }
}
