package com.ducanhdev.bookingticket.ui.movies;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.adapter.MovieAdapter;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Movie;
import com.ducanhdev.bookingticket.utils.MovieSearchUtils;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MoviesFragment extends Fragment implements MovieAdapter.OnMovieClickListener {

    private static final int TAB_NOW_PLAYING = 0;
    private static final int TAB_COMING_SOON = 1;
    private static final int TAB_ALL_MOVIES = 2;

    private SwipeRefreshLayout swipeRefresh;
    private RecyclerView movieRecycler;
    private ProgressBar loadingProgress;
    private TextView stateText;
    private TextView tabNowPlaying;
    private TextView tabComingSoon;
    private TextView tabAllMovies;
    private EditText searchInput;

    private MovieAdapter movieAdapter;
    private final List<Movie> currentMovies = new ArrayList<>();
    private int selectedTab = TAB_NOW_PLAYING;
    private String searchQuery = "";
    private Call<List<Movie>> activeCall;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_movies, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initViews(view);
        setupRecycler();
        setupTabs();
        setupSearch();
        loadMovies();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (activeCall != null) {
            activeCall.cancel();
            activeCall = null;
        }
    }

    private void initViews(View view) {
        swipeRefresh = view.findViewById(R.id.swipe_refresh);
        movieRecycler = view.findViewById(R.id.movie_recycler);
        loadingProgress = view.findViewById(R.id.loading_progress);
        stateText = view.findViewById(R.id.state_text);
        tabNowPlaying = view.findViewById(R.id.tab_now_playing);
        tabComingSoon = view.findViewById(R.id.tab_coming_soon);
        tabAllMovies = view.findViewById(R.id.tab_all_movies);
        searchInput = view.findViewById(R.id.movie_search_input);

        swipeRefresh.setColorSchemeResources(R.color.primary);
        swipeRefresh.setProgressBackgroundColorSchemeResource(R.color.surface);
        swipeRefresh.setOnRefreshListener(this::loadMovies);
    }

    private void setupRecycler() {
        movieAdapter = new MovieAdapter(this);
        movieRecycler.setLayoutManager(new GridLayoutManager(requireContext(), 2));
        movieRecycler.setAdapter(movieAdapter);
    }

    private void setupTabs() {
        tabNowPlaying.setOnClickListener(v -> selectTab(TAB_NOW_PLAYING));
        tabComingSoon.setOnClickListener(v -> selectTab(TAB_COMING_SOON));
        tabAllMovies.setOnClickListener(v -> selectTab(TAB_ALL_MOVIES));
        updateTabStyle();
    }

    private void selectTab(int tab) {
        if (selectedTab == tab) return;
        selectedTab = tab;
        updateTabStyle();
        loadMovies();
    }

    private void setupSearch() {
        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchQuery = s == null ? "" : s.toString().trim();
                applyMovieSearch();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    private void loadMovies() {
        if (activeCall != null) {
            activeCall.cancel();
        }

        showLoading();
        activeCall = createMovieCall();
        activeCall.enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (!isAdded() || call.isCanceled()) return;
                hideLoading();

                if (response.isSuccessful() && response.body() != null) {
                    currentMovies.clear();
                    currentMovies.addAll(response.body());
                    applyMovieSearch();
                } else {
                    currentMovies.clear();
                    movieAdapter.setMovies(null);
                    showState(getString(R.string.movies_load_error));
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                if (!isAdded() || call.isCanceled()) return;
                hideLoading();
                currentMovies.clear();
                movieAdapter.setMovies(null);
                showState(getString(R.string.connection_error_format, t.getMessage()));
            }
        });
    }

    private void applyMovieSearch() {
        if (movieAdapter == null) return;

        List<Movie> filteredMovies = MovieSearchUtils.filterMovies(currentMovies, searchQuery);
        movieAdapter.setMovies(filteredMovies);

        if (currentMovies.isEmpty()) {
            showState(getString(R.string.movies_empty));
        } else if (filteredMovies.isEmpty()) {
            showState(getString(R.string.movies_search_empty));
        } else {
            showState(null);
        }
    }

    private Call<List<Movie>> createMovieCall() {
        if (selectedTab == TAB_COMING_SOON) {
            return ApiClient.getMovieApi().getComingSoonMovies();
        }
        if (selectedTab == TAB_ALL_MOVIES) {
            return ApiClient.getMovieApi().getActiveMovies();
        }
        return ApiClient.getMovieApi().getNowShowingMovies();
    }

    private void showLoading() {
        loadingProgress.setVisibility(View.VISIBLE);
        stateText.setVisibility(View.GONE);
    }

    private void hideLoading() {
        loadingProgress.setVisibility(View.GONE);
        swipeRefresh.setRefreshing(false);
    }

    private void showState(String message) {
        if (message == null) {
            stateText.setVisibility(View.GONE);
            return;
        }
        stateText.setText(message);
        stateText.setVisibility(View.VISIBLE);
    }

    private void updateTabStyle() {
        styleTab(tabNowPlaying, selectedTab == TAB_NOW_PLAYING);
        styleTab(tabComingSoon, selectedTab == TAB_COMING_SOON);
        styleTab(tabAllMovies, selectedTab == TAB_ALL_MOVIES);
    }

    private void styleTab(TextView tab, boolean selected) {
        tab.setBackgroundResource(selected ? R.drawable.bg_movie_tab_selected : R.drawable.bg_chip);
        tab.setTextColor(ContextCompat.getColor(
                requireContext(),
                selected ? R.color.movie_tab_selected_text : R.color.text_secondary
        ));
        tab.setTypeface(null, selected ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL);
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
}
