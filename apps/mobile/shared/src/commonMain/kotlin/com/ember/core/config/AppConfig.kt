package com.ember.core.config

/**
 * Runtime configuration shared by every platform.
 * Each entry point passes its own instance to `initKoin` (see `EmberApplication`, `KoinIos.kt`).
 */
data class AppConfig(
    val apiBaseUrl: String = defaultApiBaseUrl(),
    /** Off by default so release builds never log requests; entry points enable it in debug. */
    val enableHttpLogs: Boolean = false,
)

/** Platform-specific default base URL (emulators don't resolve `localhost` the same way). */
expect fun defaultApiBaseUrl(): String
