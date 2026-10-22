package com.ember.core.result

/** Errors surfaced by the data layer, independent of the networking library. */
sealed interface AppError {
    data class Http(val code: Int, val message: String?) : AppError
    data class Network(val cause: Throwable) : AppError
    data class Unknown(val cause: Throwable) : AppError
}

/** Lightweight Result type: repositories never throw, they return an [AppResult]. */
sealed interface AppResult<out T> {
    data class Success<T>(val data: T) : AppResult<T>
    data class Failure(val error: AppError) : AppResult<Nothing>
}

inline fun <T, R> AppResult<T>.map(transform: (T) -> R): AppResult<R> = when (this) {
    is AppResult.Success -> AppResult.Success(transform(data))
    is AppResult.Failure -> this
}

fun AppError.toUserMessage(): String = when (this) {
    is AppError.Http -> message ?: "Server error ($code)"
    is AppError.Network -> "Network unavailable. Check your connection."
    is AppError.Unknown -> cause.message ?: "Unexpected error"
}
