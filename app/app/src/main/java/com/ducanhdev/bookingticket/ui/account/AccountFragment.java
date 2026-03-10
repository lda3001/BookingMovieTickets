package com.ducanhdev.bookingticket.ui.account;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.ui.auth.LoginActivity;
import com.ducanhdev.bookingticket.utils.SessionManager;
import com.google.android.material.button.MaterialButton;

public class AccountFragment extends Fragment {

    private LinearLayout notLoggedInLayout;
    private ScrollView loggedInLayout;
    private MaterialButton btnLogin;
    private MaterialButton btnLogout;
    private TextView userName;
    private TextView userEmail;
    private LinearLayout menuProfile;
    private LinearLayout menuTransactions;

    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_account, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        sessionManager = new SessionManager(requireContext());
        initViews(view);
        setupClickListeners();
    }

    @Override
    public void onResume() {
        super.onResume();
        updateUI();
    }

    private void initViews(View view) {
        notLoggedInLayout = view.findViewById(R.id.not_logged_in_layout);
        loggedInLayout = view.findViewById(R.id.logged_in_layout);
        btnLogin = view.findViewById(R.id.btn_login);
        btnLogout = view.findViewById(R.id.btn_logout);
        userName = view.findViewById(R.id.user_name);
        userEmail = view.findViewById(R.id.user_email);
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

        menuProfile.setOnClickListener(v -> {
            // TODO: Open profile activity
        });

        menuTransactions.setOnClickListener(v -> {
            // TODO: Open transaction history activity
        });
    }

    private void updateUI() {
        if (sessionManager.isLoggedIn()) {
            notLoggedInLayout.setVisibility(View.GONE);
            loggedInLayout.setVisibility(View.VISIBLE);
            
            String fullName = sessionManager.getFullName();
            String email = sessionManager.getEmail();
            
            userName.setText(fullName != null && !fullName.isEmpty() ? fullName : "Người dùng");
            userEmail.setText(email != null ? email : "");
        } else {
            notLoggedInLayout.setVisibility(View.VISIBLE);
            loggedInLayout.setVisibility(View.GONE);
        }
    }
}
