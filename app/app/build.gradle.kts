plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.ducanhdev.bookingticket"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.ducanhdev.bookingticket"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    
    // Retrofit for API calls
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp.logging)
    
    // Glide for image loading
    implementation(libs.glide)
    annotationProcessor(libs.glide.compiler)
    implementation(libs.glide.okhttp3)
    
    // ViewPager2 for slider
    implementation(libs.viewpager2)
    
    // RecyclerView
    implementation(libs.recyclerview)
    
    // SwipeRefreshLayout
    implementation(libs.swiperefreshlayout)
    
    // CircleImageView for avatar
    implementation(libs.circleimageview)
    
    // CardView
    implementation(libs.cardview)
    
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}