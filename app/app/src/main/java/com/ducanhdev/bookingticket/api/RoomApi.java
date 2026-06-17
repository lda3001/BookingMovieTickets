package com.ducanhdev.bookingticket.api;

import com.ducanhdev.bookingticket.model.Room;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface RoomApi {
    @GET("rooms/{id}")
    Call<Room> getRoomById(@Path("id") int id);
}
