package com.ember.features.items.domain

import com.ember.core.pagination.Page
import com.ember.core.result.AppResult

/** Repository contract. The presentation layer only depends on this interface. */
interface ItemsRepository {
    suspend fun getItems(page: Int = 1, limit: Int = PAGE_SIZE): AppResult<Page<Item>>
    suspend fun createItem(name: String, description: String? = null): AppResult<Item>
    suspend fun deleteItem(id: String): AppResult<Unit>

    companion object {
        /** Mirrors `PAGINATION.DEFAULT_LIMIT` in `packages/contracts`. */
        const val PAGE_SIZE = 20
    }
}
