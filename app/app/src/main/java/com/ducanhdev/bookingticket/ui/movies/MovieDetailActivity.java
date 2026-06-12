package com.ducanhdev.bookingticket.ui.movies;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Movie;
import com.ducanhdev.bookingticket.model.Showtime;
import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.google.android.material.button.MaterialButton;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieDetailActivity extends AppCompatActivity {

    private CollapsingToolbarLayout collapsingToolbar;
    private Toolbar toolbar;
    private ImageView movieBackdrop;
    private ImageView moviePoster;
    private TextView movieTitle;
    private TextView movieRating;
    private TextView movieDuration;
    private TextView movieGenre;
    private TextView ageBadge;
    private TextView btnPlayTrailer;
    private LinearLayout detailsContainer;
    private LinearLayout showtimeDateContainer;
    private LinearLayout cinemaShowtimeContainer;
    private FrameLayout seatFragmentContainer;
    private TextView showtimeStateText;
    private TextView movieDescription;
    private MaterialButton btnBuyTicket;
    private ProgressBar loadingProgress;

    private int movieId;
    private String movieSlug;
    private Movie currentMovie;
    private List<Showtime> allShowtimes = new ArrayList<>();
    private String selectedShowDate;
    private Showtime selectedShowtime;
    private Call<List<Showtime>> showtimeCall;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_detail);

        movieId = getIntent().getIntExtra("movie_id", -1);
        movieSlug = getIntent().getStringExtra("movie_slug");

        initViews();
        setupToolbar();
        setupSeatFragmentContainer();
        loadMovieDetails();
    }

    @Override
    protected void onDestroy() {
        if (showtimeCall != null) {
            showtimeCall.cancel();
        }
        super.onDestroy();
    }

    private void initViews() {
        collapsingToolbar = findViewById(R.id.collapsing_toolbar);
        toolbar = findViewById(R.id.toolbar);
        movieBackdrop = findViewById(R.id.movie_backdrop);
        moviePoster = findViewById(R.id.movie_poster);
        movieTitle = findViewById(R.id.movie_title);
        movieRating = findViewById(R.id.movie_rating);
        movieDuration = findViewById(R.id.movie_duration);
        movieGenre = findViewById(R.id.movie_genre);
        ageBadge = findViewById(R.id.age_badge);
        btnPlayTrailer = findViewById(R.id.btn_play_trailer);
        detailsContainer = findViewById(R.id.details_container);
        showtimeDateContainer = findViewById(R.id.showtime_date_container);
        cinemaShowtimeContainer = findViewById(R.id.cinema_showtime_container);
        seatFragmentContainer = findViewById(R.id.seat_fragment_container);
        showtimeStateText = findViewById(R.id.showtime_state_text);
        movieDescription = findViewById(R.id.movie_description);
        btnBuyTicket = findViewById(R.id.btn_buy_ticket);
        loadingProgress = findViewById(R.id.loading_progress);

        btnPlayTrailer.setOnClickListener(v -> playTrailer());
        btnBuyTicket.setOnClickListener(v -> {
            if (selectedShowtime == null) {
                Toast.makeText(this, "Vui lòng chọn ngày, rạp và giờ chiếu", Toast.LENGTH_SHORT).show();
                return;
            }

            showSeatSelectionFragment();
        });
    }

    private void setupSeatFragmentContainer() {
        getSupportFragmentManager().addOnBackStackChangedListener(() -> {
            boolean hasSeatFragment = getSupportFragmentManager().getBackStackEntryCount() > 0;
            seatFragmentContainer.setVisibility(hasSeatFragment ? View.VISIBLE : View.GONE);
        });
    }

    private void setupToolbar() {
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }
        toolbar.setNavigationOnClickListener(v -> onBackPressed());
    }

    private void loadMovieDetails() {
        loadingProgress.setVisibility(View.VISIBLE);

        Call<Movie> call;
        if (movieSlug != null && !movieSlug.isEmpty()) {
            call = ApiClient.getMovieApi().getMovieBySlug(movieSlug);
        } else if (movieId > 0) {
            call = ApiClient.getMovieApi().getMovieById(movieId);
        } else {
            loadingProgress.setVisibility(View.GONE);
            showError("Không tìm thấy thông tin phim");
            return;
        }

        call.enqueue(new Callback<Movie>() {
            @Override
            public void onResponse(Call<Movie> call, Response<Movie> response) {
                loadingProgress.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    currentMovie = response.body();
                    displayMovie(currentMovie);
                    loadShowtimes(currentMovie);
                } else {
                    showError("Không tìm thấy thông tin phim");
                }
            }

            @Override
            public void onFailure(Call<Movie> call, Throwable t) {
                loadingProgress.setVisibility(View.GONE);
                showError("Lỗi kết nối: " + t.getMessage());
            }
        });
    }

    private void displayMovie(Movie movie) {
        detailsContainer.removeAllViews();
        collapsingToolbar.setTitle(movie.getTitle());
        movieTitle.setText(movie.getTitle());

        String rating = movie.getRating();
        movieRating.setText(rating != null && !rating.isEmpty() && !rating.equals("N/A") ? rating : "N/A");

        if (movie.getDuration() != null) {
            movieDuration.setText(movie.getDuration());
        }

        if (movie.getGenre() != null) {
            movieGenre.setText(movie.getGenre());
        }

        String ageRating = movie.getAgeRating();
        if (ageRating != null && !ageRating.isEmpty()) {
            ageBadge.setText(ageRating);
            ageBadge.setVisibility(View.VISIBLE);
            int colorRes = getAgeRatingColor(ageRating);
            GradientDrawable background = (GradientDrawable) ageBadge.getBackground();
            background.setColor(ContextCompat.getColor(this, colorRes));
        } else {
            ageBadge.setVisibility(View.GONE);
        }

        String description = movie.getDescription();
        if (description == null || description.isEmpty()) {
            description = movie.getContent();
        }
        movieDescription.setText(description != null && !description.isEmpty() ? description : "Chưa có mô tả");

        String imageUrl = movie.getFullImageUrl();
        if (imageUrl != null) {
            Glide.with(this).load(imageUrl).centerCrop().into(movieBackdrop);
            Glide.with(this).load(imageUrl).centerCrop().into(moviePoster);
        }

        addDetailItem("Đạo diễn", movie.getDirector());
        addDetailItem("Diễn viên", movie.getCast());
        addDetailItem("Quốc gia", movie.getCountry());
        addDetailItem("Nhà sản xuất", movie.getProducer());
        addDetailItem("Khởi chiếu", movie.getReleaseDate());
    }

    private void loadShowtimes(Movie movie) {
        if (showtimeCall != null) {
            showtimeCall.cancel();
        }

        resetShowtimeUi("Đang tải lịch chiếu...");
        showtimeCall = ApiClient.getShowtimeApi().getShowtimesByMovie(movie.getId());

        showtimeCall.enqueue(new Callback<List<Showtime>>() {
            @Override
            public void onResponse(Call<List<Showtime>> call, Response<List<Showtime>> response) {
                if (call.isCanceled()) return;

                if (response.isSuccessful() && response.body() != null) {
                    allShowtimes = response.body();
                    selectedShowDate = null;
                    selectedShowtime = null;
                    renderShowtimeDates();
                } else {
                    resetShowtimeUi("Không thể tải lịch chiếu");
                }
            }

            @Override
            public void onFailure(Call<List<Showtime>> call, Throwable t) {
                if (call.isCanceled()) return;
                resetShowtimeUi("Lỗi tải lịch chiếu: " + t.getMessage());
            }
        });
    }

    private void renderShowtimeDates() {
        showtimeDateContainer.removeAllViews();
        cinemaShowtimeContainer.removeAllViews();

        Map<String, List<Showtime>> byDate = groupShowtimesByDate(allShowtimes);
        if (byDate.isEmpty()) {
            resetShowtimeUi("Chưa có lịch chiếu cho phim này");
            return;
        }

        showtimeStateText.setVisibility(View.GONE);
        if (selectedShowDate == null || !byDate.containsKey(selectedShowDate)) {
            selectedShowDate = byDate.keySet().iterator().next();
            selectedShowtime = null;
        }

        updateBookingButton();
        for (String date : byDate.keySet()) {
            TextView chip = createChip(formatDisplayDate(date), date.equals(selectedShowDate));
            chip.setOnClickListener(v -> {
                selectedShowDate = date;
                selectedShowtime = null;
                renderShowtimeDates();
            });
            showtimeDateContainer.addView(chip);
        }

        renderCinemasForDate(byDate.get(selectedShowDate));
    }

    private void renderCinemasForDate(List<Showtime> showtimes) {
        cinemaShowtimeContainer.removeAllViews();
        Map<String, List<Showtime>> byCinema = new LinkedHashMap<>();
        if (showtimes != null) {
            for (Showtime showtime : showtimes) {
                byCinema.computeIfAbsent(getCinemaName(showtime), key -> new ArrayList<>()).add(showtime);
            }
        }

        if (byCinema.isEmpty()) {
            showtimeStateText.setText("Không có suất chiếu trong ngày đã chọn");
            showtimeStateText.setVisibility(View.VISIBLE);
            return;
        }

        showtimeStateText.setVisibility(View.GONE);
        for (Map.Entry<String, List<Showtime>> entry : byCinema.entrySet()) {
            cinemaShowtimeContainer.addView(createCinemaShowtimeView(entry.getKey(), entry.getValue()));
        }
    }

    private LinearLayout createCinemaShowtimeView(String cinemaName, List<Showtime> showtimes) {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setBackgroundResource(R.drawable.bg_panel);
        panel.setPadding(dpToPx(12), dpToPx(12), dpToPx(12), dpToPx(12));

        LinearLayout.LayoutParams panelParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        panelParams.setMargins(0, 0, 0, dpToPx(10));
        panel.setLayoutParams(panelParams);

        TextView title = new TextView(this);
        title.setText(cinemaName);
        title.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        title.setTextSize(15);
        title.setTypeface(null, Typeface.BOLD);
        panel.addView(title);

        String roomSummary = buildRoomSummary(showtimes);
        if (!roomSummary.isEmpty()) {
            TextView subtitle = new TextView(this);
            subtitle.setText(roomSummary);
            subtitle.setTextColor(ContextCompat.getColor(this, R.color.text_hint));
            subtitle.setTextSize(12);
            subtitle.setPadding(0, dpToPx(4), 0, 0);
            panel.addView(subtitle);
        }

        LinearLayout timesRow = new LinearLayout(this);
        timesRow.setOrientation(LinearLayout.HORIZONTAL);
        timesRow.setPadding(0, dpToPx(10), 0, 0);
        timesRow.setBaselineAligned(false);
        panel.addView(timesRow);

        for (Showtime showtime : showtimes) {
            TextView timeChip = createChip(formatShowtime(showtime), isSelectedShowtime(showtime));
            timeChip.setOnClickListener(v -> {
                selectedShowtime = showtime;
                selectedShowDate = extractDate(showtime.getShowTime());
                renderShowtimeDates();
            });
            timesRow.addView(timeChip);
        }

        return panel;
    }

    private TextView createChip(String text, boolean selected) {
        TextView chip = new TextView(this);
        chip.setText(text);
        chip.setGravity(Gravity.CENTER);
        chip.setTextSize(12);
        chip.setTypeface(null, selected ? Typeface.BOLD : Typeface.NORMAL);
        chip.setTextColor(ContextCompat.getColor(this, selected ? R.color.primary_light : R.color.text_secondary));
        chip.setBackgroundResource(selected ? R.drawable.bg_primary_chip : R.drawable.bg_chip);
        chip.setPadding(dpToPx(12), dpToPx(8), dpToPx(12), dpToPx(8));

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 0, dpToPx(8), 0);
        chip.setLayoutParams(params);
        return chip;
    }

    private Map<String, List<Showtime>> groupShowtimesByDate(List<Showtime> showtimes) {
        Map<String, List<Showtime>> result = new LinkedHashMap<>();
        if (showtimes == null) return result;

        for (Showtime showtime : showtimes) {
            String date = extractDate(showtime.getShowTime());
            if (date == null) continue;
            result.computeIfAbsent(date, key -> new ArrayList<>()).add(showtime);
        }
        return result;
    }

    private void resetShowtimeUi(String message) {
        showtimeDateContainer.removeAllViews();
        cinemaShowtimeContainer.removeAllViews();
        selectedShowtime = null;
        btnBuyTicket.setText("Chọn suất chiếu");
        showtimeStateText.setText(message);
        showtimeStateText.setVisibility(View.VISIBLE);
    }

    private void updateBookingButton() {
        if (selectedShowtime == null) {
            btnBuyTicket.setText("Chọn suất chiếu");
            return;
        }

        btnBuyTicket.setText("Đặt vé - " + formatShowtime(selectedShowtime));
    }

    private void showSeatSelectionFragment() {
        if (currentMovie == null || selectedShowtime == null) return;

        seatFragmentContainer.setVisibility(View.VISIBLE);
        SeatSelectionFragment fragment = SeatSelectionFragment.newInstance(
                selectedShowtime.getId(),
                currentMovie.getTitle(),
                getCinemaName(selectedShowtime),
                selectedShowtime.getRoomId(),
                getRoomName(selectedShowtime),
                selectedShowtime.getShowTime(),
                selectedShowtime.getPrice()
        );

        getSupportFragmentManager()
                .beginTransaction()
                .setReorderingAllowed(true)
                .replace(R.id.seat_fragment_container, fragment)
                .addToBackStack("seat_selection")
                .commit();
    }

    private boolean isSelectedShowtime(Showtime showtime) {
        return selectedShowtime == showtime
                || (selectedShowtime != null && selectedShowtime.getId() > 0 && selectedShowtime.getId() == showtime.getId());
    }

    private String getCinemaName(Showtime showtime) {
        if (showtime.getCinemaName() != null && !showtime.getCinemaName().isEmpty()) {
            return showtime.getCinemaName();
        }
        if (showtime.getCinema() != null && showtime.getCinema().getName() != null) {
            return showtime.getCinema().getName();
        }
        return "Cinema";
    }

    private String buildRoomSummary(List<Showtime> showtimes) {
        if (showtimes == null || showtimes.isEmpty()) return "";

        Showtime first = showtimes.get(0);
        String roomName = first.getRoomName();
        if ((roomName == null || roomName.isEmpty()) && first.getRoom() != null) {
            roomName = first.getRoom().getName();
        }

        String format = first.getFormat();
        if (roomName != null && !roomName.isEmpty() && format != null && !format.isEmpty()) {
            return roomName + " - " + format;
        }
        if (roomName != null && !roomName.isEmpty()) {
            return roomName;
        }
        return format != null ? format : "";
    }

    private String getRoomName(Showtime showtime) {
        if (showtime.getRoomName() != null && !showtime.getRoomName().isEmpty()) {
            return showtime.getRoomName();
        }
        if (showtime.getRoom() != null && showtime.getRoom().getName() != null) {
            return showtime.getRoom().getName();
        }
        return "";
    }

    private String extractDate(String showTime) {
        if (showTime == null || showTime.length() < 10) return null;
        return showTime.substring(0, 10);
    }

    private String formatShowtime(Showtime showtime) {
        String showTime = showtime.getShowTime();
        if (showTime == null) return "--:--";
        if (showTime.length() >= 16) return showTime.substring(11, 16);
        return showTime;
    }

    private String formatDisplayDate(String date) {
        try {
            SimpleDateFormat input = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
            SimpleDateFormat output = new SimpleDateFormat("EEE, dd/MM", Locale.US);
            return output.format(input.parse(date));
        } catch (ParseException e) {
            return date;
        }
    }

    private void playTrailer() {
        if (currentMovie == null) return;

        String videoId = extractYoutubeVideoId(currentMovie.getTrailerUrl());
        if (videoId == null) {
            Toast.makeText(this, "Phim chưa có trailer", Toast.LENGTH_SHORT).show();
            return;
        }

        String watchUrl = "https://www.youtube.com/watch?v=" + videoId;
        String embedUrl = "https://www.youtube.com/embed/" + videoId + "?rel=0&playsinline=1";

        WebView webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dpToPx(230)
        ));
        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.black));
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportMultipleWindows(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        String html = "<!doctype html><html><head>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<style>html,body{margin:0;padding:0;background:#000;height:100%;overflow:hidden;}"
                + "iframe{border:0;width:100%;height:100%;}</style>"
                + "</head><body>"
                + "<iframe src='" + embedUrl + "' "
                + "allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' "
                + "allowfullscreen></iframe>"
                + "</body></html>";

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Trailer")
                .setView(webView)
                .setPositiveButton("Mở YouTube", (d, which) -> openYoutube(watchUrl))
                .setNegativeButton("Đóng", null)
                .create();

        dialog.setOnShowListener(d -> webView.loadDataWithBaseURL(
                "https://www.youtube.com",
                html,
                "text/html",
                "UTF-8",
                null
        ));

        dialog.setOnDismissListener(d -> {
            webView.loadUrl("about:blank");
            webView.stopLoading();

            ViewParent parent = webView.getParent();
            if (parent instanceof ViewGroup) {
                ((ViewGroup) parent).removeView(webView);
            }

            webView.destroy();
        });

        dialog.show();
    }

    private void openYoutube(String url) {
        Intent appIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        appIntent.setPackage("com.google.android.youtube");

        try {
            startActivity(appIntent);
        } catch (Exception ignored) {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(browserIntent);
        }
    }

    private String extractYoutubeVideoId(String trailerUrl) {
        if (trailerUrl == null) return null;

        String url = trailerUrl.trim();
        if (url.isEmpty()) return null;

        if (url.matches("^[a-zA-Z0-9_-]{11}$")) {
            return url;
        }

        String[] markers = {"v=", "youtu.be/", "embed/", "shorts/", "live/"};
        for (String marker : markers) {
            int start = url.indexOf(marker);
            if (start < 0) continue;

            start += marker.length();
            int end = start;
            while (end < url.length()) {
                char c = url.charAt(end);
                if (!(Character.isLetterOrDigit(c) || c == '_' || c == '-')) {
                    break;
                }
                end++;
            }

            if (end - start == 11) {
                return url.substring(start, end);
            }
        }

        return null;
    }

    private void addDetailItem(String label, String value) {
        if (value == null || value.isEmpty()) return;

        LinearLayout item = new LinearLayout(this);
        item.setOrientation(LinearLayout.HORIZONTAL);
        item.setPadding(0, dpToPx(8), 0, dpToPx(8));

        TextView labelView = new TextView(this);
        labelView.setText(label + ": ");
        labelView.setTextColor(ContextCompat.getColor(this, R.color.text_hint));
        labelView.setTextSize(14);
        labelView.setMinWidth(dpToPx(104));

        TextView valueView = new TextView(this);
        valueView.setText(value);
        valueView.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        valueView.setTextSize(14);

        item.addView(labelView);
        item.addView(valueView);
        detailsContainer.addView(item);
    }

    private int getAgeRatingColor(String ageRating) {
        switch (ageRating) {
            case "T18":
                return R.color.age_rating_t18;
            case "T16":
                return R.color.age_rating_t16;
            case "T13":
                return R.color.age_rating_t13;
            case "K":
            case "P":
            default:
                return R.color.age_rating_p;
        }
    }

    private void showError(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
