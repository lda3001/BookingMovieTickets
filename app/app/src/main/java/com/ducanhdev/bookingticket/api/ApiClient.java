package com.ducanhdev.bookingticket.api;

import android.content.Context;
import android.content.SharedPreferences;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.concurrent.TimeUnit;

public class ApiClient {
    
    // Use 10.0.2.2 for Android Emulator to access localhost
    // Change this to your actual server IP for real device testing
    private static final String BASE_URL = "http://10.0.2.2:8080/api/";
    
    private static Retrofit retrofit = null;
    private static Context appContext = null;
    
    public static void init(Context context) {
        appContext = context.getApplicationContext();
    }
    
    private static String getToken() {
        if (appContext == null) return null;
        SharedPreferences prefs = appContext.getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("token", null);
    }
    
    public static Retrofit getClient() {
        if (retrofit == null) {
            // Logging interceptor for debugging
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
            
            // OkHttp client with auth interceptor
            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(chain -> {
                        Request original = chain.request();
                        Request.Builder requestBuilder = original.newBuilder();
                        
                        // Add auth token if available
                        String token = getToken();
                        if (token != null && !token.isEmpty()) {
                            requestBuilder.header("Authorization", "Bearer " + token);
                        }
                        
                        requestBuilder.header("Content-Type", "application/json");
                        return chain.proceed(requestBuilder.build());
                    })
                    .addInterceptor(loggingInterceptor)
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .build();
            
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
    
    // API interfaces
    public static MovieApi getMovieApi() {
        return getClient().create(MovieApi.class);
    }
    
    public static AuthApi getAuthApi() {
        return getClient().create(AuthApi.class);
    }
    
    public static BookingApi getBookingApi() {
        return getClient().create(BookingApi.class);
    }
    
    public static ShowtimeApi getShowtimeApi() {
        return getClient().create(ShowtimeApi.class);
    }
    
    public static CinemaApi getCinemaApi() {
        return getClient().create(CinemaApi.class);
    }
    
    // Reset client (useful when token changes)
    public static void resetClient() {
        retrofit = null;
    }
}
