package com.ducanhdev.bookingticket.ui.auth;

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
import com.ducanhdev.bookingticket.model.RegisterRequest;
import com.ducanhdev.bookingticket.utils.SessionManager;
import com.ducanhdev.bookingticket.utils.ThemeManager;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private ImageView btnBack;
    private TextInputLayout fullNameLayout;
    private TextInputEditText fullNameInput;
    private TextInputLayout emailLayout;
    private TextInputEditText emailInput;
    private TextInputLayout phoneLayout;
    private TextInputEditText phoneInput;
    private TextInputLayout dobLayout;
    private TextInputEditText dobInput;
    private TextInputLayout passwordLayout;
    private TextInputEditText passwordInput;
    private TextInputLayout confirmPasswordLayout;
    private TextInputEditText confirmPasswordInput;
    private TextView errorText;
    private MaterialButton btnRegister;
    private ProgressBar loadingProgress;
    private TextView btnLogin;

    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ThemeManager.applySavedTheme(this);
        super.onCreate(savedInstanceState);
        getWindow().setWindowAnimations(0);
        overridePendingTransition(0, 0);
        configureSystemBars();
        setContentView(R.layout.activity_register);

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
        fullNameLayout = findViewById(R.id.full_name_layout);
        fullNameInput = findViewById(R.id.full_name_input);
        emailLayout = findViewById(R.id.email_layout);
        emailInput = findViewById(R.id.email_input);
        phoneLayout = findViewById(R.id.phone_layout);
        phoneInput = findViewById(R.id.phone_input);
        dobLayout = findViewById(R.id.dob_layout);
        dobInput = findViewById(R.id.dob_input);
        passwordLayout = findViewById(R.id.password_layout);
        passwordInput = findViewById(R.id.password_input);
        confirmPasswordLayout = findViewById(R.id.confirm_password_layout);
        confirmPasswordInput = findViewById(R.id.confirm_password_input);
        errorText = findViewById(R.id.error_text);
        btnRegister = findViewById(R.id.btn_register);
        loadingProgress = findViewById(R.id.loading_progress);
        btnLogin = findViewById(R.id.btn_login);
    }

    private void setupClickListeners() {
        btnBack.setOnClickListener(v -> finish());
        btnLogin.setOnClickListener(v -> finish());
        btnRegister.setOnClickListener(v -> attemptRegister());
    }

    private void attemptRegister() {
        clearErrors();

        String fullName = textOf(fullNameInput);
        String email = textOf(emailInput);
        String phone = textOf(phoneInput);
        String dob = textOf(dobInput);
        String password = textOf(passwordInput);
        String confirmPassword = textOf(confirmPasswordInput);

        if (fullName.isEmpty()) {
            fullNameLayout.setError("Vui lòng nhập họ tên");
            return;
        }

        if (email.isEmpty()) {
            emailLayout.setError("Vui lòng nhập email");
            return;
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailLayout.setError("Email không hợp lệ");
            return;
        }

        if (!phone.isEmpty() && phone.length() < 9) {
            phoneLayout.setError("Số điện thoại không hợp lệ");
            return;
        }

        if (!dob.isEmpty() && !isValidDate(dob)) {
            dobLayout.setError("Ngày sinh phải có dạng dd/MM/yyyy");
            return;
        }

        if (password.isEmpty()) {
            passwordLayout.setError("Vui lòng nhập mật khẩu");
            return;
        }

        if (password.length() < 6) {
            passwordLayout.setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (!password.equals(confirmPassword)) {
            confirmPasswordLayout.setError("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        RegisterRequest request = new RegisterRequest(
                email,
                password,
                fullName,
                phone.isEmpty() ? null : phone,
                dob.isEmpty() ? null : dob
        );

        ApiClient.getAuthApi().register(request).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                setLoading(false);
                if (response.isSuccessful() && response.body() != null) {
                    sessionManager.saveSession(response.body());
                    ApiClient.resetClient();
                    Toast.makeText(RegisterActivity.this, "Đăng ký thành công", Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    showError("Không thể đăng ký. Email có thể đã tồn tại.");
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                setLoading(false);
                showError("Lỗi kết nối: " + t.getMessage());
            }
        });
    }

    private void clearErrors() {
        fullNameLayout.setError(null);
        emailLayout.setError(null);
        phoneLayout.setError(null);
        dobLayout.setError(null);
        passwordLayout.setError(null);
        confirmPasswordLayout.setError(null);
        errorText.setVisibility(View.GONE);
    }

    private boolean isValidDate(String value) {
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
        format.setLenient(false);
        try {
            format.parse(value);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

    private String textOf(TextInputEditText input) {
        return input.getText() != null ? input.getText().toString().trim() : "";
    }

    private void setLoading(boolean loading) {
        if (loading) {
            btnRegister.setText("");
            btnRegister.setEnabled(false);
            loadingProgress.setVisibility(View.VISIBLE);
        } else {
            btnRegister.setText("Sign Up");
            btnRegister.setEnabled(true);
            loadingProgress.setVisibility(View.GONE);
        }
    }

    private void showError(String message) {
        errorText.setText(message);
        errorText.setVisibility(View.VISIBLE);
    }
}
