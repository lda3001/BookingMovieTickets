package com.ducanhdev.bookingticket.adapter;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.model.Movie;

import java.util.List;

public class HeroSliderAdapter extends RecyclerView.Adapter<HeroSliderAdapter.SliderViewHolder> {

    private List<Movie> movies;
    private OnSliderClickListener listener;

    public interface OnSliderClickListener {
        void onSliderClick(Movie movie);
    }

    public HeroSliderAdapter(List<Movie> movies, OnSliderClickListener listener) {
        this.movies = movies;
        this.listener = listener;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public SliderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_slider, parent, false);
        return new SliderViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SliderViewHolder holder, int position) {
        Movie movie = movies.get(position);
        holder.bind(movie);
    }

    @Override
    public int getItemCount() {
        return movies != null ? movies.size() : 0;
    }

    class SliderViewHolder extends RecyclerView.ViewHolder {
        private ImageView sliderImage;
        private TextView sliderTitle;
        private TextView sliderSubtitle;

        public SliderViewHolder(@NonNull View itemView) {
            super(itemView);
            sliderImage = itemView.findViewById(R.id.slider_image);
            sliderTitle = itemView.findViewById(R.id.slider_title);
            sliderSubtitle = itemView.findViewById(R.id.slider_subtitle);

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onSliderClick(movies.get(position));
                }
            });
        }

        public void bind(Movie movie) {
            sliderTitle.setText(movie.getTitle());
            
            if (movie.getGenre() != null && !movie.getGenre().isEmpty()) {
                sliderSubtitle.setText(movie.getGenre());
                sliderSubtitle.setVisibility(View.VISIBLE);
            } else if (movie.getTagline() != null && !movie.getTagline().isEmpty()) {
                sliderSubtitle.setText(movie.getTagline());
                sliderSubtitle.setVisibility(View.VISIBLE);
            } else {
                sliderSubtitle.setVisibility(View.GONE);
            }

            // Load image with Glide
            String imageUrl = movie.getFullImageUrl();
            Log.d("HeroSliderAdapter", "Loading slider image: " + imageUrl);
            if (imageUrl != null && !imageUrl.isEmpty()) {
                Glide.with(itemView.getContext())
                        .load(imageUrl)
                        .listener(new RequestListener<android.graphics.drawable.Drawable>() {
                            @Override
                            public boolean onLoadFailed(@androidx.annotation.Nullable GlideException e, Object model, Target<android.graphics.drawable.Drawable> target, boolean isFirstResource) {
                                Log.e("HeroSliderAdapter", "Failed to load slider image: " + imageUrl, e);
                                return false;
                            }

                            @Override
                            public boolean onResourceReady(android.graphics.drawable.Drawable resource, Object model, Target<android.graphics.drawable.Drawable> target, DataSource dataSource, boolean isFirstResource) {
                                Log.d("HeroSliderAdapter", "Successfully loaded slider image: " + imageUrl);
                                return false;
                            }
                        })
                        .transition(DrawableTransitionOptions.withCrossFade())
                        .centerCrop()
                        .into(sliderImage);
            }
        }
    }
}
