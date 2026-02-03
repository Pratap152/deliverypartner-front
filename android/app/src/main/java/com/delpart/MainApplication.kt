package com.delpart

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here
        },
    )
  }

  override fun onCreate() {
    super.onCreate()

    // 🔥 REQUIRED FOR REAL-TIME FCM (Android 8+)
    createNotificationChannels()

    loadReactNative(this)
  }

  /**
   * High priority notification channel
   * Used for delivery, order, earnings & urgent alerts
   */
  private fun createNotificationChannels() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        "high_priority", // MUST MATCH backend payload
        "High Priority Notifications",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Delivery partner real-time notifications"
        enableVibration(true)
        enableLights(true)
      }

      val manager =
        getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.createNotificationChannel(channel)
    }
  }
}
