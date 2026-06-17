package com.ducanhdev.bookingticket.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowInsetsControllerCompat;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.AuthResponse;
import com.ducanhdev.bookingticket.model.LoginRequest;
import com.ducanhdev.bookingticket.utils.LanguageManager;
import com.ducanhdev.bookingticket.utils.SessionManager;
import com.ducanhdev.bookingticket.utils.ThemeManager;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ImageView btnBack;
    private TextInputLayout emailLayout;
    private TextInputEditText emailInput;
    private TextInputLayout passwordLayout;
    private TextInputEditText passwordInput;
    private TextView errorText;
    private MaterialButton btnLogin;
    private ProgressBar loadingProgress;
    private TextView btnRegister;

    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        LanguageManager.applySavedLanguage(this);
        ThemeManager.applySavedTheme(this);
        super.onCreate(savedInstanceState);
        getWindow().setWindowAnimations(0);
        overridePendingTransition(0, 0);
        configureSystemBars();
        setContentView(R.layout.activity_login);

        sessionManager = new SessionManager(this);
        initViews();
        setupClickListeners();
    }

    private void configureSystemBars() {
        boolean isLightMode = !ThemeManager.isDarkMode(this);
        WindowInsetsControllerCompat controller =
                new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(isLightMode);
        controller.setAppearanceLightNavigationBars(isLightMode);
    }

    private void initViews() {
        btnBack = findViewById(R.id.btn_back);
        emailLayout = findViewById(R.id.email_layout);
        emailInput = findViewById(R.id.email_input);
        passwordLayout = findViewById(R.id.password_layout);
        passwordInput = findViewById(R.id.password_input);
        errorText = findViewById(R.id.error_text);
        btnLogin = findViewById(R.id.btn_login);
        loadingProgress = findViewById(R.id.loading_progress);
        btnRegister = findViewById(R.id.btn_register);
    }

    private void setupClickListeners() {
        btnBack.setOnClickListener(v -> finish());
        btnLogin.setOnClickListener(v -> attemptLogin());
        btnRegister.setOnClickListener(v -> startActivity(new Intent(this, RegisterActivity.class)));
    }

    private void attemptLogin() {
        emailLayout.setError(null);
        passwordLayout.setError(null);
        errorText.setVisibility(View.GONE);

        String email = emailInput.getText() != null ? emailInput.getText().toString().trim() : "";
        String password = passwordInput.getText() != null ? passwordInput.getText().toString().trim() : "";

        if (email.isEmpty()) {
            emailLayout.setError(getString(R.string.login_email_required));
            return;
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailLayout.setError(getString(R.string.login_email_invalid));
            return;
        }

        if (password.isEmpty()) {
            passwordLayout.setError(getString(R.string.login_password_required));
            return;
        }

        if (password.length() < 6) {
            passwordLayout.setError(getString(R.string.login_password_min));
            return;
        }

        setLoading(true);

        LoginRequest request = new LoginRequest(email, password);
        ApiClient.getAuthApi().login(request).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                setLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse authResponse = response.body();
                    sessionManager.saveSession(authResponse);
                    ApiClient.resetClient();

                    Toast.makeText(LoginActivity.this, getString(R.string.login_success), Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    showError(getString(R.string.login_failed));
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                setLoading(false);
                showError(getString(R.string.connection_error_format, t.getMessage()));
            }
        });
    }

    private void setLoading(boolean loading) {
        if (loading) {
            btnLogin.setText("");
            btnLogin.setEnabled(false);
            loadingProgress.setVisibility(View.VISIBLE);
        } else {
            btnLogin.setText(R.string.sign_in);
            btnLogin.setEnabled(true);
            loadingProgress.setVisibility(View.GONE);
        }
    }

    private void showError(String message) {
        errorText.setText(message);
        errorText.setVisibility(View.VISIBLE);
    }
}
