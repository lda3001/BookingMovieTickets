package com.galaxycinema.util;

import com.galaxycinema.dto.response.MovieResponse;
import com.galaxycinema.entity.Movie;   
import com.galaxycinema.entity.Room;
import com.galaxycinema.entity.Cinema;
import com.galaxycinema.entity.Showtime;
import com.galaxycinema.entity.Booking;
import com.galaxycinema.dto.response.RoomResponse;
import com.galaxycinema.dto.response.CinemaResponse;
import com.galaxycinema.dto.response.ShowtimeResponse;
import com.galaxycinema.dto.response.BookingResponse;

import java.util.List;

public interface Mappers
{
    MovieResponse toMovieResponse(Movie movie);
    List<MovieResponse> toMovieResponseList(List<Movie> movies);
    Movie toMovie(MovieResponse movieResponse);

    RoomResponse toRoomResponse(Room room);
    List<RoomResponse> toRoomResponseList(List<Room> rooms);
    Room toRoom(RoomResponse roomResponse);

    CinemaResponse toCinemaResponse(Cinema cinema);
    List<CinemaResponse> toCinemaResponseList(List<Cinema> cinemas);
    Cinema toCinema(CinemaResponse cinemaResponse);

    ShowtimeResponse toShowtimeResponse(Showtime showtime);
    List<ShowtimeResponse> toShowtimeResponseList(List<Showtime> showtimes);
    Showtime toShowtime(ShowtimeResponse showtimeResponse); 

    BookingResponse toBookingResponse(Booking booking);
    List<BookingResponse> toBookingResponseList(List<Booking> bookings);
    Booking toBooking(BookingResponse bookingResponse);

}
