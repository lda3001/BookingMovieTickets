package com.galaxycinema.util.implementation;

import com.galaxycinema.util.Mappers;
import com.galaxycinema.dto.response.MovieResponse;
import com.galaxycinema.entity.Movie;
import com.galaxycinema.dto.response.RoomResponse;
import com.galaxycinema.entity.Room;
import com.galaxycinema.dto.response.CinemaResponse;
import com.galaxycinema.entity.Cinema;
import com.galaxycinema.dto.response.ShowtimeResponse;
import com.galaxycinema.entity.Showtime;
import com.galaxycinema.dto.response.BookingResponse;
import com.galaxycinema.entity.Booking;
import com.galaxycinema.entity.User;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MappersImpl implements Mappers {
    @Override
    public MovieResponse toMovieResponse(Movie movie) {
        return new MovieResponse(
            movie.getId(),
            movie.getSlug(),
            movie.getTitle(),
            movie.getImage(),
            movie.getDuration(),
            movie.getRating(),
            movie.getReleaseDate(),
            movie.getCountry(),
            movie.getProducer(),
            movie.getGenre(),
            movie.getDirector(),
            movie.getCast(),
            movie.getTagline(),
            movie.getSubtitle(),
            movie.getTrailerUrl(),
            movie.getContent(),
            movie.getDescription(),
            movie.getIsActive(),
            movie.getCreatedAt(),
            movie.getUpdatedAt()
        
        );
    }

    @Override
    public List<MovieResponse> toMovieResponseList(List<Movie> movies) {
        return movies.stream().map(this::toMovieResponse).collect(Collectors.toList());
    }

    @Override
    public Movie toMovie(MovieResponse movieResponse) {
        return Movie.builder()
            .id(movieResponse.id())
            .slug(movieResponse.slug())
            .title(movieResponse.title())
            .image(movieResponse.image())
            .duration(movieResponse.duration())
            .rating(movieResponse.rating())
            .releaseDate(movieResponse.releaseDate())
            .country(movieResponse.country())
            .producer(movieResponse.producer())
            .genre(movieResponse.genre())
            .director(movieResponse.director())
            .cast(movieResponse.cast())
            .tagline(movieResponse.tagline())
            .subtitle(movieResponse.subtitle())
            .trailerUrl(movieResponse.trailerUrl())
            .content(movieResponse.content())
            .description(movieResponse.description())
            .showtimes(null)
            .isActive(movieResponse.isActive())
            .createdAt(movieResponse.createdAt())
            .updatedAt(movieResponse.updatedAt())
            .build();
    }

    @Override
    public RoomResponse toRoomResponse(Room room) {
        return new RoomResponse(
            room.getId(),
            room.getName(),
            room.getCinema() != null ? room.getCinema().getId() : null,
            room.getCinema() != null ? room.getCinema().getName() : null,
            room.getTotalRows(),
            room.getSeatsPerRow(),
            room.getVipRows(),
            room.getIsActive(),
            room.getCreatedAt(),
            room.getUpdatedAt()
        );
    }

    @Override
    public List<RoomResponse> toRoomResponseList(List<Room> rooms) {
        return rooms.stream().map(this::toRoomResponse).collect(Collectors.toList());
    }

    @Override
    public Room toRoom(RoomResponse roomResponse) {
        Cinema cinema = null;
        if (roomResponse.cinemaId() != null) {
            cinema = Cinema.builder()
                .id(roomResponse.cinemaId())
                .build();
        }
        return Room.builder()
            .id(roomResponse.id())
            .name(roomResponse.name())
            .cinema(cinema)
            .totalRows(roomResponse.totalRows())
            .seatsPerRow(roomResponse.seatsPerRow())
            .vipRows(roomResponse.vipRows())
            .seats(null)
            .showtimes(null)
            .isActive(roomResponse.isActive())
            .createdAt(roomResponse.createdAt())
            .updatedAt(roomResponse.updatedAt())
            .build();
    }

    @Override
    public CinemaResponse toCinemaResponse(Cinema cinema) {
        return new CinemaResponse(
            cinema.getId(),
            cinema.getName(),
            cinema.getAddress(),
            cinema.getPhone(),
            cinema.getCity(),
            cinema.getTotalRooms(),
            cinema.getIsActive(),
            cinema.getCreatedAt(),
            cinema.getUpdatedAt()
        );
    }

    @Override
    public List<CinemaResponse> toCinemaResponseList(List<Cinema> cinemas) {
        return cinemas.stream().map(this::toCinemaResponse).collect(Collectors.toList());
    }

    @Override
    public Cinema toCinema(CinemaResponse cinemaResponse) {
        return Cinema.builder()
            .id(cinemaResponse.id())
            .name(cinemaResponse.name())
            .address(cinemaResponse.address())
            .phone(cinemaResponse.phone())
            .city(cinemaResponse.city())
            .totalRooms(cinemaResponse.totalRooms())
            .rooms(null)
            .showtimes(null)
            .isActive(cinemaResponse.isActive())
            .createdAt(cinemaResponse.createdAt())
            .updatedAt(cinemaResponse.updatedAt())
            .build();
    }

    @Override
    public ShowtimeResponse toShowtimeResponse(Showtime showtime) {
        return new ShowtimeResponse(
            showtime.getId(),
            showtime.getMovie() != null ? showtime.getMovie().getId() : null,
            showtime.getMovie() != null ? showtime.getMovie().getTitle() : null,
            showtime.getMovie() != null ? showtime.getMovie().getSlug() : null,
            showtime.getCinema() != null ? showtime.getCinema().getId() : null,
            showtime.getCinema() != null ? showtime.getCinema().getName() : null,
            showtime.getRoom() != null ? showtime.getRoom().getId() : null,
            showtime.getRoom() != null ? showtime.getRoom().getName() : null,
            showtime.getShowTime(),
            showtime.getEndTime(),
            showtime.getFormat(),
            showtime.getPrice(),
            showtime.getIsActive(),
            showtime.getCreatedAt(),
            showtime.getUpdatedAt()
        );
    }

    @Override
    public List<ShowtimeResponse> toShowtimeResponseList(List<Showtime> showtimes) {
        return showtimes.stream().map(this::toShowtimeResponse).collect(Collectors.toList());
    }

    @Override
    public Showtime toShowtime(ShowtimeResponse showtimeResponse) {
        Movie movie = null;
        if (showtimeResponse.movieId() != null) {
            movie = Movie.builder()
                .id(showtimeResponse.movieId())
                .build();
        }
        
        Cinema cinema = null;
        if (showtimeResponse.cinemaId() != null) {
            cinema = Cinema.builder()
                .id(showtimeResponse.cinemaId())
                .build();
        }
        
        Room room = null;
        if (showtimeResponse.roomId() != null) {
            room = Room.builder()
                .id(showtimeResponse.roomId())
                .build();
        }
        
        return Showtime.builder()
            .id(showtimeResponse.id())
            .movie(movie)
            .cinema(cinema)
            .room(room)
            .showTime(showtimeResponse.showTime())
            .endTime(showtimeResponse.endTime())
            .format(showtimeResponse.format())
            .price(showtimeResponse.price())
            .bookings(null)
            .bookedSeats(null)
            .isActive(showtimeResponse.isActive())
            .createdAt(showtimeResponse.createdAt())
            .updatedAt(showtimeResponse.updatedAt())
            .build();
    }

    @Override
    public BookingResponse toBookingResponse(Booking booking) {
        List<String> seatCodes = booking.getBookedSeats() != null
            ? booking.getBookedSeats().stream()
                .map(bookedSeat -> bookedSeat.getSeatCode() != null ? bookedSeat.getSeatCode() : "")
                .filter(code -> !code.isEmpty())
                .collect(Collectors.toList())
            : List.of();
        
        return new BookingResponse(
            booking.getId(),
            booking.getBookingCode(),
            booking.getUser() != null ? booking.getUser().getId() : null,
            booking.getUser() != null ? booking.getUser().getEmail() : null,
            booking.getUser() != null ? booking.getUser().getFullName() : null,
            booking.getShowtime() != null ? booking.getShowtime().getId() : null,
            booking.getShowtime() != null ? booking.getShowtime().getShowTime() : null,
            booking.getShowtime() != null && booking.getShowtime().getMovie() != null 
                ? booking.getShowtime().getMovie().getTitle() : null,
            booking.getShowtime() != null && booking.getShowtime().getCinema() != null 
                ? booking.getShowtime().getCinema().getName() : null,
            booking.getShowtime() != null && booking.getShowtime().getRoom() != null 
                ? booking.getShowtime().getRoom().getName() : null,
            seatCodes,
            booking.getTotalPrice(),
            booking.getStatus(),
            booking.getPaymentMethod(),
            booking.getPaymentStatus(),
            booking.getCreatedAt(),
            booking.getUpdatedAt()
        );
    }

    @Override
    public List<BookingResponse> toBookingResponseList(List<Booking> bookings) {
        return bookings.stream().map(this::toBookingResponse).collect(Collectors.toList());
    }

    @Override
    public Booking toBooking(BookingResponse bookingResponse) {
        User user = null;
        if (bookingResponse.userId() != null) {
            user = User.builder()
                .id(bookingResponse.userId())
                .build();
        }
        
        Showtime showtime = null;
        if (bookingResponse.showtimeId() != null) {
            showtime = Showtime.builder()
                .id(bookingResponse.showtimeId())
                .build();
        }
        
        return Booking.builder()
            .id(bookingResponse.id())
            .bookingCode(bookingResponse.bookingCode())
            .user(user)
            .showtime(showtime)
            .bookedSeats(null)
            .totalPrice(bookingResponse.totalPrice())
            .status(bookingResponse.status())
            .paymentMethod(bookingResponse.paymentMethod())
            .paymentStatus(bookingResponse.paymentStatus())
            .createdAt(bookingResponse.createdAt())
            .updatedAt(bookingResponse.updatedAt())
            .build();
    }
}
