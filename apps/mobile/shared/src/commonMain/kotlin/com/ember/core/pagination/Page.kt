package com.ember.core.pagination

/** One page of a paginated list, mirroring the API `{ data, meta }` envelope. */
data class Page<T>(
    val items: List<T>,
    val page: Int,
    val limit: Int,
    val total: Int,
)
