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

    private fun repository(engine: MockEngine) = ItemsRepositoryImpl(KtorItemsApi(createHttpClient(config, engine)))

    @Test
    fun getItems_mapsPageToDomain() = runTest {
        val engine = MockEngine { request ->
            assertEquals("2", request.url.parameters["page"])
            assertEquals("20", request.url.parameters["limit"])
            respond(
                content = """
                    {"data":[{"id":"1","name":"First","description":null,
                    "createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"}],
                    "meta":{"page":2,"limit":20,"total":21}}
                """.trimIndent(),
                headers = jsonHeaders,
            )
        }

        val result = repository(engine).getItems(page = 2)

        assertIs<AppResult.Success<*>>(result)
        val page = (result as AppResult.Success).data
        assertEquals("First", page.items.single().name)
        assertEquals(2, page.page)
        assertEquals(21, page.total)
    }

    @Test
    fun getItems_mapsHttpErrorsWithApiMessage() = runTest {
        val engine = MockEngine {
            respond(
                content = """{"statusCode":400,"message":["page must not be less than 1","limit must be an integer"],"path":"/api/v1/items","timestamp":"2026-01-01T00:00:00.000Z"}""",
                status = HttpStatusCode.BadRequest,
                headers = jsonHeaders,
            )
        }

        val result = repository(engine).getItems()

        assertIs<AppResult.Failure>(result)
        val error = assertIs<AppError.Http>(result.error)
        assertEquals(400, error.code)
        assertEquals("page must not be less than 1, limit must be an integer", error.message)
    }

    @Test
    fun getItems_fallsBackToStatusDescription() = runTest {
        val engine = MockEngine { respond("", HttpStatusCode.InternalServerError) }

        val result = repository(engine).getItems()

        assertIs<AppResult.Failure>(result)
        val error = assertIs<AppError.Http>(result.error)
        assertEquals(500, error.code)
        assertEquals("Internal Server Error", error.message)
    }
}
