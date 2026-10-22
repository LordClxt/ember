package com.ember.core.network

import com.ember.core.config.AppConfig
import io.ktor.client.HttpClient
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/**
 * Builds the single [HttpClient] used by the app.
 * Pass an [engine] in tests (e.g. `MockEngine`); otherwise the platform engine is used
 * (OkHttp on Android, Darwin on iOS).
 */
fun createHttpClient(config: AppConfig, engine: HttpClientEngine? = null): HttpClient {
    val block: io.ktor.client.HttpClientConfig<*>.() -> Unit = {
        expectSuccess = true
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true; explicitNulls = false })
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 15_000
        }
        if (config.enableHttpLogs) {
            install(Logging) { level = LogLevel.INFO }
        }
        defaultRequest {
            url(config.apiBaseUrl.trimEnd('/') + "/")
            contentType(ContentType.Application.Json)
        }
    }
    return if (engine != null) HttpClient(engine, block) else HttpClient(block)
}
