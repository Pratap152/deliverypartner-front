package com.delpart

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder

class LocationForegroundService : Service() {

    override fun onCreate() {
        super.onCreate()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "gps_tracking",
                "GPS Tracking",
                NotificationManager.IMPORTANCE_LOW
            )

            val manager =
                getSystemService(NotificationManager::class.java)

            manager.createNotificationChannel(channel)
        }

        val notification =
            Notification.Builder(this, "gps_tracking")
                .setContentTitle("Delivery Partner")
                .setContentText("Location tracking active")
                .setSmallIcon(R.mipmap.ic_launcher)
                .build()

        startForeground(101, notification)
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {

        android.util.Log.d(
            "ForegroundService",
            "Service started"
        )

        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}