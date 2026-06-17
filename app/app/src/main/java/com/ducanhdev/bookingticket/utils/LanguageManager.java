package com.ducanhdev.bookingticket.utils;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.os.LocaleListCompat;

public final class LanguageManager {
    public static final String LANGUAGE_VI = "vi";
    public static final String LANGUAGE_EN = "en";

    private static final String PREFS_NAME = "language_prefs";
    private static final String KEY_LANGUAGE = "language";
    private static final String DEFAULT_LANGUAGE = LANGUAGE_VI;

    private LanguageManager() {
    }

    public static void applySavedLanguage(Context context) {
        applyLanguageTag(getLanguage(context));
    }

    public static String getLanguage(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return normalizeLanguage(prefs.getString(KEY_LANGUAGE, DEFAULT_LANGUAGE));
    }

    public static void setLanguage(Context context, String language) {
        String normalizedLanguage = normalizeLanguage(language);
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        if (!normalizedLanguage.equals(prefs.getString(KEY_LANGUAGE, DEFAULT_LANGUAGE))) {
            prefs.edit().putString(KEY_LANGUAGE, normalizedLanguage).apply();
        }
        applyLanguageTag(normalizedLanguage);
    }

    private static void applyLanguageTag(String language) {
        LocaleListCompat locales = LocaleListCompat.forLanguageTags(language);
        if (!AppCompatDelegate.getApplicationLocales().equals(locales)) {
            AppCompatDelegate.setApplicationLocales(locales);
        }
    }

    private static String normalizeLanguage(String language) {
        return LANGUAGE_EN.equals(language) ? LANGUAGE_EN : LANGUAGE_VI;
    }
}
