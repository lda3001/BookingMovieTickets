package com.ducanhdev.bookingticket.adapter;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.ducanhdev.bookingticket.R;
import com.ducanhdev.bookingticket.model.Movie;

import java.util.ArrayList;
import java.util.List;

public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {

    private List<Movie> movies = new ArrayList<>();
    private OnMovieClickListener listener;

    public interface OnMovieClickListener {
        void onMovieClick(Movie movie);
        void onBuyTicketClick(Movie movie);
    }

    public MovieAdapter(OnMovieClickListener listener) {
        this.listener = listener;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies != null ? movies : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_movie_card, parent, false);
        return new MovieViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        Movie movie = movies.get(position);
        holder.bind(movie);
    }

    @Override
    public int getItemCount() {
        return movies.size();
    }

    class MovieViewHolder extends RecyclerView.ViewHolder {
        private ImageView moviePoster;
        private LinearLayout ratingBadge;
        private TextView ratingText;
        private TextView ageBadge;
        private LinearLayout buyOverlay;
        private TextView movieTitle;
        private ImageView durationIcon;
        private TextView movieDuration;

        public MovieViewHolder(@NonNull View itemView) {
            super(itemView);
            moviePoster = itemView.findViewById(R.id.movie_poster);
            ratingBadge = itemView.findViewById(R.id.rating_badge);
            ratingText = itemView.findViewById(R.id.rating_text);
            ageBadge = itemView.findViewById(R.id.age_badge);
            buyOverlay = itemView.findViewById(R.id.buy_overlay);
            movieTitle = itemView.findViewById(R.id.movie_title);
            durationIcon = itemView.findViewById(R.id.duration_icon);
            movieDuration = itemView.findViewById(R.id.movie_duration);

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onMovieClick(movies.get(position));
                }
            });

            buyOverlay.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onBuyTicketClick(movies.get(position));
                }
            });
        }

        public void bind(Movie movie) {
            movieTitle.setText(movie.getTitle());

            // Rating
            String rating = movie.getRating();
            if (rating != null && !rating.isEmpty() && !rating.equals("N/A")) {
                try {
                    float ratingValue = Float.parseFloat(rating);
                    if (ratingValue > 0) {
                        ratingText.setText(rating);
                        ratingBadge.setVisibility(View.VISIBLE);
                    } else {
                        ratingBadge.setVisibility(View.GONE);
                    }
                } catch (NumberFormatException e) {
                    ratingBadge.setVisibility(View.GONE);
                }
            } else {
                ratingBadge.setVisibility(View.GONE);
            }

            // Age Rating
            String ageRating = movie.getAgeRating();
            if (ageRating != null && !ageRating.isEmpty()) {
                ageBadge.setText(ageRating);
                ageBadge.setVisibility(View.VISIBLE);
                
                // Set color based on age rating
                int colorRes = getAgeRatingColor(ageRating);
                GradientDrawable background = (GradientDrawable) ageBadge.getBackground();
                background.setColor(ContextCompat.getColor(itemView.getContext(), colorRes));
            } else {
                ageBadge.setVisibility(View.GONE);
            }

            // Duration
            String duration = movie.getDuration();
            if (duration != null && !duration.isEmpty()) {
                movieDuration.setText(duration);
                movieDuration.setVisibility(View.VISIBLE);
                durationIcon.setVisibility(View.VISIBLE);
            } else {
                movieDuration.setVisibility(View.GONE);
                durationIcon.setVisibility(View.GONE);
            }

            // Load poster
            String imageUrl = movie.getFullImageUrl();
            Log.d("MovieAdapter", "Loading image for " + movie.getTitle() + ": " + imageUrl);
            if (imageUrl != null && !imageUrl.isEmpty()) {
                // Create GlideUrl with custom headers to bypass CDN restrictions
                com.bumptech.glide.load.model.GlideUrl glideUrl = new com.bumptech.glide.load.model.GlideUrl(
                        imageUrl,
                        new com.bumptech.glide.load.model.LazyHeaders.Builder()
                                .addHeader("User-Agent", "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36")
                                .addHeader("Referer", "https://www.galaxycine.vn/")
                                .build()
                );
                
                Glide.with(itemView.getContext())
                        .load(glideUrl)
                        .listener(new RequestListener<android.graphics.drawable.Drawable>() {
                            @Override
                            public boolean onLoadFailed(@androidx.annotation.Nullable GlideException e, Object model, Target<android.graphics.drawable.Drawable> target, boolean isFirstResource) {
                                Log.e("MovieAdapter", "Failed to load image: " + imageUrl, e);
                                return false; // Allow error drawable to be shown
                            }

                            @Override
                            public boolean onResourceReady(android.graphics.drawable.Drawable resource, Object model, Target<android.graphics.drawable.Drawable> target, DataSource dataSource, boolean isFirstResource) {
                                Log.d("MovieAdapter", "Successfully loaded image: " + imageUrl);
                                return false; // Allow Glide to handle the resource
                            }
                        })
                        .transition(DrawableTransitionOptions.withCrossFade())
                        .centerCrop()
                        .placeholder(R.drawable.placeholder_movie)
                        .error(R.drawable.placeholder_movie)
                        .into(moviePoster);
            } else {
                moviePoster.setImageResource(R.drawable.placeholder_movie);
            }
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
    }
}
