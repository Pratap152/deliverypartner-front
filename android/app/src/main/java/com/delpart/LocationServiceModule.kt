package com.delpart

import android.content.Intent
import androidx.core.content.ContextCompat

import com.facebook.react.bridge.*

class LocationServiceModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "LocationService"

    @ReactMethod
    fun startService() {

        val intent = Intent(
            reactApplicationContext,
            LocationForegroundService::class.java
        )

        ContextCompat.startForegroundService(
            reactApplicationContext,
            intent
        )
    }

    @ReactMethod
    fun stopService() {

        reactApplicationContext.stopService(
            Intent(
                reactApplicationContext,
                LocationForegroundService::class.java
            )
        )
    }
}