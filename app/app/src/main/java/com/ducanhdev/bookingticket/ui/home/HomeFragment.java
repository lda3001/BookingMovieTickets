package com.ducanhdev.bookingticket.ui.home;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.viewpager2.widget.ViewPager2;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.adapter.HeroSliderAdapter;
import com.ducanhdev.bookingticket.adapter.MovieAdapter;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Movie;
import com.ducanhdev.bookingticket.ui.movies.MovieDetailActivity;
import com.google.android.material.tabs.TabLayout;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeFragment extends Fragment implements 
        HeroSliderAdapter.OnSliderClickListener,
        MovieAdapter.OnMovieClickListener {

    private ViewPager2 heroSlider;
    private LinearLayout sliderIndicator;
    private TabLayout movieTabs;
    private RecyclerView movieRecycler;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar loadingProgress;
    private TextView errorText;

    private HeroSliderAdapter sliderAdapter;
    private MovieAdapter movieAdapter;

    private List<Movie> nowShowingMovies = new ArrayList<>();
    private List<Movie> comingSoonMovies = new ArrayList<>();

    private Handler sliderHandler = new Handler(Looper.getMainLooper());
    private Runnable sliderRunnable;
    private int currentSliderPosition = 0;
    private static final int SLIDER_DELAY = 5000; // 5 seconds

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initViews(view);
        setupSlider();
        setupMovieGrid();
        setupTabs();
        setupSwipeRefresh();
        loadData();
    }

    private void initViews(View view) {
        heroSlider = view.findViewById(R.id.hero_slider);
        sliderIndicator = view.findViewById(R.id.slider_indicator);
        movieTabs = view.findViewById(R.id.movie_tabs);
        movieRecycler = view.findViewById(R.id.movie_recycler);
        swipeRefresh = view.findViewById(R.id.swipe_refresh);
        loadingProgress = view.findViewById(R.id.loading_progress);
        errorText = view.findViewById(R.id.error_text);
    }

    private void setupSlider() {
        sliderAdapter = new HeroSliderAdapter(new ArrayList<>(), this);
        heroSlider.setAdapter(sliderAdapter);

        heroSlider.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                currentSliderPosition = position;
                updateIndicators(position);
                resetSliderTimer();
            }
        });

        // Auto scroll runnable
        sliderRunnable = () -> {
            if (sliderAdapter.getItemCount() > 0) {
                currentSliderPosition = (currentSliderPosition + 1) % sliderAdapter.getItemCount();
                heroSlider.setCurrentItem(currentSliderPosition, true);
            }
        };
    }

    private void setupIndicators(int count) {
        sliderIndicator.removeAllViews();
        for (int i = 0; i < count; i++) {
            ImageView dot = new ImageView(requireContext());
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    dpToPx(8), dpToPx(8)
            );
            params.setMargins(dpToPx(4), 0, dpToPx(4), 0);
            dot.setLayoutParams(params);
            dot.setImageResource(R.drawable.indicator_dot);
            dot.setColorFilter(ContextCompat.getColor(requireContext(), 
                    i == 0 ? R.color.primary : R.color.text_hint));
            sliderIndicator.addView(dot);
        }
    }

    private void updateIndicators(int position) {
        for (int i = 0; i < sliderIndicator.getChildCount(); i++) {
            ImageView dot = (ImageView) sliderIndicator.getChildAt(i);
            dot.setColorFilter(ContextCompat.getColor(requireContext(),
                    i == position ? R.color.primary : R.color.text_hint));
        }
    }

    private void resetSliderTimer() {
        sliderHandler.removeCallbacks(sliderRunnable);
        sliderHandler.postDelayed(sliderRunnable, SLIDER_DELAY);
    }

    private void setupMovieGrid() {
        movieAdapter = new MovieAdapter(this);
        GridLayoutManager layoutManager = new GridLayoutManager(requireContext(), 2);
        movieRecycler.setLayoutManager(layoutManager);
        movieRecycler.setAdapter(movieAdapter);
    }

    private void setupTabs() {
        movieTabs.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if (tab.getPosition() == 0) {
                    movieAdapter.setMovies(nowShowingMovies);
                } else {
                    movieAdapter.setMovies(comingSoonMovies);
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}

            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeResources(R.color.primary);
        swipeRefresh.setProgressBackgroundColorSchemeResource(R.color.surface);
        swipeRefresh.setOnRefreshListener(this::loadData);
    }

    private void loadData() {
        showLoading();
        loadNowShowingMovies();
        loadComingSoonMovies();
    }

    private void loadNowShowingMovies() {
        ApiClient.getMovieApi().getNowShowingMovies().enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    nowShowingMovies = response.body();
                    
                    // Update slider with first 5 movies
                    List<Movie> sliderMovies = nowShowingMovies.size() > 5 
                            ? nowShowingMovies.subList(0, 5) 
                            : nowShowingMovies;
                    sliderAdapter.setMovies(sliderMovies);
                    setupIndicators(sliderMovies.size());
                    resetSliderTimer();

                    // Update grid if on "Now Showing" tab
                    if (movieTabs.getSelectedTabPosition() == 0) {
                        movieAdapter.setMovies(nowShowingMovies);
                    }
                    
                    hideLoading();
                } else {
                    showError("Không thể tải danh sách phim");
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                showError("Lỗi kết nối: " + t.getMessage());
            }
        });
    }

    private void loadComingSoonMovies() {
        ApiClient.getMovieApi().getComingSoonMovies().enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    comingSoonMovies = response.body();
                    
                    // Update grid if on "Coming Soon" tab
                    if (movieTabs.getSelectedTabPosition() == 1) {
                        movieAdapter.setMovies(comingSoonMovies);
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                // Silent fail for coming soon
            }
        });
    }

    private void showLoading() {
        loadingProgress.setVisibility(View.VISIBLE);
        errorText.setVisibility(View.GONE);
    }

    private void hideLoading() {
        loadingProgress.setVisibility(View.GONE);
        errorText.setVisibility(View.GONE);
        swipeRefresh.setRefreshing(false);
    }

    private void showError(String message) {
        loadingProgress.setVisibility(View.GONE);
        errorText.setText(message);
        errorText.setVisibility(View.VISIBLE);
        swipeRefresh.setRefreshing(false);
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    @Override
    public void onSliderClick(Movie movie) {
        openMovieDetail(movie);
    }

    @Override
    public void onMovieClick(Movie movie) {
        openMovieDetail(movie);
    }

    @Override
    public void onBuyTicketClick(Movie movie) {
        openMovieDetail(movie);
    }

    private void openMovieDetail(Movie movie) {
        Intent intent = new Intent(requireContext(), MovieDetailActivity.class);
        intent.putExtra("movie_id", movie.getId());
        intent.putExtra("movie_slug", movie.getSlug());
        startActivity(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        resetSliderTimer();
    }

    @Override
    public void onPause() {
        super.onPause();
        sliderHandler.removeCallbacks(sliderRunnable);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        sliderHandler.removeCallbacksAndMessages(null);
    }
}
