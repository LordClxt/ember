package com.ember.core.network

import com.ember.core.result.AppError
import com.ember.core.result.AppResult
import io.ktor.client.plugins.ResponseException
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import kotlinx.coroutines.CancellationException
import kotlinx.io.IOException
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

/** Wraps a network call and maps exceptions to [AppError]. Never swallows cancellation. */
suspend fun <T> safeApiCall(block: suspend () -> T): AppResult<T> = try {
    AppResult.Success(block())
} catch (e: CancellationException) {
    throw e
} catch (e: ResponseException) {
    AppResult.Failure(AppError.Http(e.response.status.value, e.response.apiErrorMessage()))
} catch (e: IOException) {
    AppResult.Failure(AppError.Network(e))
} catch (e: Exception) {
    AppResult.Failure(AppError.Unknown(e))
}

/**
 * Reads `message` from the API error envelope
 * (`{ statusCode, message: string | string[], path, timestamp }`),
 * falling back to the HTTP reason phrase.
 */
internal suspend fun HttpResponse.apiErrorMessage(): String {
    val message = try {
        when (val value = Json.parseToJsonElement(bodyAsText()).jsonObject["message"]) {
            is JsonArray -> value.joinToString(", ") { it.jsonPrimitive.content }
            is JsonPrimitive -> value.content
            else -> null
        }
    } catch (e: CancellationException) {
        throw e
    } catch (_: Exception) {
        null
    }
    return message?.takeIf { it.isNotBlank() } ?: status.description
}
