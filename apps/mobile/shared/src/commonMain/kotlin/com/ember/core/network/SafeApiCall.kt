package com.ember.core.network

import com.ember.core.result.AppError
import com.ember.core.result.AppResult
import io.ktor.client.plugins.ResponseException
import kotlinx.io.IOException
import kotlinx.coroutines.CancellationException

/** Wraps a network call and maps exceptions to [AppError]. Never swallows cancellation. */
suspend fun <T> safeApiCall(block: suspend () -> T): AppResult<T> = try {
    AppResult.Success(block())
} catch (e: CancellationException) {
    throw e
} catch (e: ResponseException) {
    AppResult.Failure(AppError.Http(e.response.status.value, e.response.status.description))
} catch (e: IOException) {
    AppResult.Failure(AppError.Network(e))
} catch (e: Exception) {
    AppResult.Failure(AppError.Unknown(e))
}
