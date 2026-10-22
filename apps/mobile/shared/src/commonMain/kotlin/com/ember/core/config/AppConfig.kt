package com.ember.core.config

/**
 * Runtime configuration shared by every platform.
 * Override values per build flavour / scheme by providing a different instance in Koin.
 */
data class AppConfig(
    val apiBaseUrl: String = defaultApiBaseUrl(),
    val enableHttpLogs: Boolean = true,
)

/** Platform-specific default base URL (emulators don't resolve `localhost` the same way). */
expect fun defaultApiBaseUrl(): String
