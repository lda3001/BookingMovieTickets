package com.ducanhdev.bookingticket.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.model.Cinema;

import java.util.ArrayList;
import java.util.List;

public class CinemaAdapter extends RecyclerView.Adapter<CinemaAdapter.CinemaViewHolder> {

    private List<Cinema> cinemas = new ArrayList<>();

    public void setCinemas(List<Cinema> cinemas) {
        this.cinemas = cinemas != null ? cinemas : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CinemaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.view_cinema_card, parent, false);
        return new CinemaViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CinemaViewHolder holder, int position) {
        holder.bind(cinemas.get(position));
    }

    @Override
    public int getItemCount() {
        return cinemas.size();
    }

    static class CinemaViewHolder extends RecyclerView.ViewHolder {
        private final TextView cinemaName;
        private final TextView cinemaCity;
        private final TextView cinemaAddress;
        private final TextView cinemaRooms;
        private final TextView cinemaPhone;
        private final TextView cinemaStatus;

        CinemaViewHolder(@NonNull View itemView) {
            super(itemView);
            cinemaName = itemView.findViewById(R.id.cinema_name);
            cinemaCity = itemView.findViewById(R.id.cinema_city);
            cinemaAddress = itemView.findViewById(R.id.cinema_address);
            cinemaRooms = itemView.findViewById(R.id.cinema_rooms);
            cinemaPhone = itemView.findViewById(R.id.cinema_phone);
            cinemaStatus = itemView.findViewById(R.id.cinema_status);
        }

        void bind(Cinema cinema) {
            cinemaName.setText(valueOrFallback(cinema.getName(), itemView.getContext().getString(R.string.cinema_fallback)));
            cinemaCity.setText(valueOrFallback(cinema.getCity(), ""));
            cinemaAddress.setText(valueOrFallback(cinema.getAddress(), itemView.getContext().getString(R.string.cinema_address_updating)));
            cinemaRooms.setText(itemView.getContext().getString(R.string.cinema_rooms_format, cinema.getTotalRooms()));
            cinemaPhone.setText(valueOrFallback(cinema.getPhone(), itemView.getContext().getString(R.string.cinema_no_phone)));
            cinemaStatus.setText(cinema.isActive()
                    ? R.string.cinema_active
                    : R.string.cinema_inactive);
        }

        private String valueOrFallback(String value, String fallback) {
            return value != null && !value.trim().isEmpty() ? value : fallback;
        }
    }
}
