package com.ember.features.items

import com.ember.core.config.AppConfig
import com.ember.core.network.createHttpClient
import com.ember.core.result.AppError
import com.ember.core.result.AppResult
import com.ember.features.items.data.ItemsRepositoryImpl
import com.ember.features.items.data.KtorItemsApi
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class ItemsRepositoryTest {
    private val config = AppConfig(apiBaseUrl = "http://test/api/v1", enableHttpLogs = false)
    private val jsonHeaders = headersOf(HttpHeaders.ContentType, "application/json")

    private fun repository(engine: MockEngine) =
        ItemsRepositoryImpl(KtorItemsApi(createHttpClient(config, engine)))

    @Test
    fun getItems_mapsDtosToDomain() = runTest {
        val engine = MockEngine {
            respond(
                content = """
                    {"data":[{"id":"1","name":"First","description":null,
                    "createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"}],
                    "meta":{"page":1,"limit":50,"total":1}}
                """.trimIndent(),
                headers = jsonHeaders,
            )
        }

        val result = repository(engine).getItems()

        assertIs<AppResult.Success<*>>(result)
        assertEquals("First", (result as AppResult.Success).data.single().name)
    }

    @Test
    fun getItems_mapsHttpErrors() = runTest {
        val engine = MockEngine { respond("", HttpStatusCode.InternalServerError) }

        val result = repository(engine).getItems()

        assertIs<AppResult.Failure>(result)
        assertEquals(500, (result.error as AppError.Http).code)
    }
}
