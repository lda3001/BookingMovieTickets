package com.ducanhdev.bookingticket.ui.cinemas;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.adapter.CinemaAdapter;
import com.ducanhdev.bookingticket.api.ApiClient;
import com.ducanhdev.bookingticket.model.Cinema;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CinemasFragment extends Fragment {

    private SwipeRefreshLayout swipeRefresh;
    private RecyclerView cinemaRecycler;
    private ProgressBar loadingProgress;
    private TextView stateText;

    private CinemaAdapter cinemaAdapter;
    private Call<List<Cinema>> activeCall;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_cinemas, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initViews(view);
        setupRecycler();
        loadCinemas();
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
        cinemaRecycler = view.findViewById(R.id.cinema_recycler);
        loadingProgress = view.findViewById(R.id.loading_progress);
        stateText = view.findViewById(R.id.state_text);

        swipeRefresh.setColorSchemeResources(R.color.primary);
        swipeRefresh.setProgressBackgroundColorSchemeResource(R.color.surface);
        swipeRefresh.setOnRefreshListener(this::loadCinemas);
    }

    private void setupRecycler() {
        cinemaAdapter = new CinemaAdapter();
        cinemaRecycler.setLayoutManager(new LinearLayoutManager(requireContext()));
        cinemaRecycler.setAdapter(cinemaAdapter);
    }

    private void loadCinemas() {
        if (activeCall != null) {
            activeCall.cancel();
        }

        showLoading();
        activeCall = ApiClient.getCinemaApi().getActiveCinemas();
        activeCall.enqueue(new Callback<List<Cinema>>() {
            @Override
            public void onResponse(Call<List<Cinema>> call, Response<List<Cinema>> response) {
                if (!isAdded() || call.isCanceled()) return;
                hideLoading();

                if (response.isSuccessful() && response.body() != null) {
                    List<Cinema> cinemas = response.body();
                    cinemaAdapter.setCinemas(cinemas);
                    showState(cinemas.isEmpty() ? "Khong co rap de hien thi" : null);
                } else {
                    cinemaAdapter.setCinemas(null);
                    showState("Khong the tai danh sach rap");
                }
            }

            @Override
            public void onFailure(Call<List<Cinema>> call, Throwable t) {
                if (!isAdded() || call.isCanceled()) return;
                hideLoading();
                cinemaAdapter.setCinemas(null);
                showState("Loi ket noi: " + t.getMessage());
            }
        });
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
}
