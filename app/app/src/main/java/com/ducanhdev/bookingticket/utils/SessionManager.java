package com.ducanhdev.bookingticket.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.ducanhdev.bookingticket.model.AuthResponse;
import com.google.gson.Gson;

public class SessionManager {
    
    private static final String PREF_NAME = "auth";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_FULL_NAME = "full_name";
    private static final String KEY_PHONE = "phone";
    private static final String KEY_DATE_OF_BIRTH = "date_of_birth";
    private static final String KEY_ROLE = "role";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";
    
    private SharedPreferences prefs;
    private SharedPreferences.Editor editor;
    private Context context;
    
    public SessionManager(Context context) {
        this.context = context;
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }
    
    /**
     * Save user session after successful login/register
     */
    public void saveSession(AuthResponse response) {
        editor.putString(KEY_TOKEN, response.getToken());
        editor.putInt(KEY_USER_ID, response.getUserId());
        editor.putString(KEY_EMAIL, response.getEmail());
        editor.putString(KEY_FULL_NAME, response.getFullName());
        editor.putString(KEY_PHONE, response.getPhone());
        editor.putString(KEY_DATE_OF_BIRTH, response.getDateOfBirth());
        editor.putString(KEY_ROLE, response.getRole());
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.apply();
    }
    
    /**
     * Check if user is logged in
     */
    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false);
    }
    
    /**
     * Get authentication token
     */
    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }
    
    /**
     * Get user ID
     */
    public int getUserId() {
        return prefs.getInt(KEY_USER_ID, -1);
    }
    
    /**
     * Get user email
     */
    public String getEmail() {
        return prefs.getString(KEY_EMAIL, null);
    }
    
    /**
     * Get user full name
     */
    public String getFullName() {
        return prefs.getString(KEY_FULL_NAME, null);
    }
    
    /**
     * Get user phone
     */
    public String getPhone() {
        return prefs.getString(KEY_PHONE, null);
    }
    
    /**
     * Get user date of birth
     */
    public String getDateOfBirth() {
        return prefs.getString(KEY_DATE_OF_BIRTH, null);
    }
    
    /**
     * Get user role
     */
    public String getRole() {
        return prefs.getString(KEY_ROLE, null);
    }
    
    /**
     * Clear session (logout)
     */
    public void logout() {
        editor.clear();
        editor.apply();
    }
    
    /**
     * Update user profile
     */
    public void updateProfile(String fullName, String phone, String dateOfBirth) {
        editor.putString(KEY_FULL_NAME, fullName);
        editor.putString(KEY_PHONE, phone);
        editor.putString(KEY_DATE_OF_BIRTH, dateOfBirth);
        editor.apply();
    }
}
