package com.ducanhdev.bookingticket;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.fragment.app.Fragment;

import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.ui.account.AccountFragment;
import com.ducanhdev.bookingticket.ui.cinemas.CinemasFragment;
import com.ducanhdev.bookingticket.ui.home.HomeFragment;
import com.ducanhdev.bookingticket.ui.movies.MoviesFragment;
import com.ducanhdev.bookingticket.utils.ThemeManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    private static final String PREFS_NAME = "navigation_prefs";
    private static final String KEY_SELECTED_NAV = "selected_nav";

    private BottomNavigationView bottomNavigation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ThemeManager.applySavedTheme(this);
        super.onCreate(savedInstanceState);
        getWindow().setWindowAnimations(0);
        overridePendingTransition(0, 0);
        EdgeToEdge.enable(this);
        configureSystemBars();
        setContentView(R.layout.activity_main);
        
        // Initialize API client
        ApiClient.init(this);
        
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0);
            return insets;
        });

        setupBottomNavigation();
        restoreSelectedDestination();
    }

    private void configureSystemBars() {
        boolean isLightMode = !ThemeManager.isDarkMode(this);
        WindowInsetsControllerCompat controller =
                new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(isLightMode);
        controller.setAppearanceLightNavigationBars(isLightMode);
    }

    private void setupBottomNavigation() {
        bottomNavigation = findViewById(R.id.bottom_navigation);
        bottomNavigation.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            saveSelectedDestination(itemId);
            Fragment fragment = createFragmentForDestination(itemId);

            if (fragment != null) {
                loadFragment(fragment);
                return true;
            }
            return false;
        });
    }

    private void loadFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .setReorderingAllowed(true)
                .replace(R.id.fragment_container, fragment)
                .commit();
    }

    private void restoreSelectedDestination() {
        int selectedItemId = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
                .getInt(KEY_SELECTED_NAV, R.id.nav_home);
        if (bottomNavigation.getSelectedItemId() == selectedItemId) {
            Fragment fragment = createFragmentForDestination(selectedItemId);
            if (fragment != null) {
                loadFragment(fragment);
            }
        } else {
            bottomNavigation.setSelectedItemId(selectedItemId);
        }
    }

    private void saveSelectedDestination(int itemId) {
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
                .edit()
                .putInt(KEY_SELECTED_NAV, itemId)
                .apply();
    }

    private Fragment createFragmentForDestination(int itemId) {
        if (itemId == R.id.nav_home) {
            return new HomeFragment();
        } else if (itemId == R.id.nav_movies) {
            return new MoviesFragment();
        } else if (itemId == R.id.nav_cinemas) {
            return new CinemasFragment();
        } else if (itemId == R.id.nav_account) {
            return new AccountFragment();
        }
        return null;
    }
}
