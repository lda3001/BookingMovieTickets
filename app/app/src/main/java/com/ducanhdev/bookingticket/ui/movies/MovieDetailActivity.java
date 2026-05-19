package com.ducanhdev.bookingticket.ui.movies;

import android.app.AlertDialog;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageView;
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
import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.google.android.material.button.MaterialButton;

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
    private TextView movieDescription;
    private MaterialButton btnBuyTicket;
    private ProgressBar loadingProgress;

    private int movieId;
    private String movieSlug;
    private Movie currentMovie;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_detail);

        movieId = getIntent().getIntExtra("movie_id", -1);
        movieSlug = getIntent().getStringExtra("movie_slug");

        initViews();
        setupToolbar();
        loadMovieDetails();
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
        movieDescription = findViewById(R.id.movie_description);
        btnBuyTicket = findViewById(R.id.btn_buy_ticket);
        loadingProgress = findViewById(R.id.loading_progress);

        btnPlayTrailer.setOnClickListener(v -> playTrailer());
        btnBuyTicket.setOnClickListener(v -> {
            if (currentMovie != null) {
                Toast.makeText(this, "Chọn suất chiếu cho " + currentMovie.getTitle(), Toast.LENGTH_SHORT).show();
            }
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

    private void playTrailer() {
        if (currentMovie == null) {
            return;
        }

        String videoId = extractYoutubeVideoId(currentMovie.getTrailerUrl());
        if (videoId == null) {
            Toast.makeText(this, "Phim chưa có trailer", Toast.LENGTH_SHORT).show();
            return;
        }

        WebView webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dpToPx(230)
        ));
        webView.setWebChromeClient(new WebChromeClient());
        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.black));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        String embedUrl = "https://www.youtube.com/embed/" + videoId
                + "?autoplay=1&playsinline=1&rel=0";

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Trailer")
                .setView(webView)
                .setNegativeButton("Đóng", null)
                .create();

        dialog.setOnDismissListener(d -> {
            webView.stopLoading();
            webView.destroy();
        });
        dialog.setOnShowListener(d -> webView.loadUrl(embedUrl));
        dialog.show();
    }

    private String extractYoutubeVideoId(String trailerUrl) {
        if (trailerUrl == null) return null;

        String url = trailerUrl.trim();
        if (url.isEmpty()) return null;

        if (url.matches("^[a-zA-Z0-9_-]{11}$")) {
            return url;
        }

        String[] markers = {"v=", "youtu.be/", "embed/", "shorts/"};
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
