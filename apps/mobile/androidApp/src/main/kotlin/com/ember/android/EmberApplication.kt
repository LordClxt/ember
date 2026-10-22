package com.ember.android

import android.app.Application
import com.ember.core.config.AppConfig
import com.ember.di.initKoin
import org.koin.android.ext.koin.androidContext

class EmberApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin(AppConfig(enableHttpLogs = BuildConfig.DEBUG)) {
            androidContext(this@EmberApplication)
        }
    }
}
