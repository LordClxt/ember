package com.ember.features.items.domain

import com.ember.core.result.AppResult

/** Repository contract. The presentation layer only depends on this interface. */
interface ItemsRepository {
    suspend fun getItems(): AppResult<List<Item>>
    suspend fun createItem(name: String, description: String? = null): AppResult<Item>
    suspend fun deleteItem(id: String): AppResult<Unit>
}
