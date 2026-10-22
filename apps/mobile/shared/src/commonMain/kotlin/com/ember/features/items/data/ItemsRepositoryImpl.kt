package com.ember.features.items.data

import com.ember.core.network.safeApiCall
import com.ember.core.result.AppResult
import com.ember.core.result.map
import com.ember.features.items.domain.Item
import com.ember.features.items.domain.ItemsRepository

class ItemsRepositoryImpl(private val api: ItemsApi) : ItemsRepository {
    override suspend fun getItems(): AppResult<List<Item>> =
        safeApiCall { api.list() }.map { page -> page.data.map { it.toDomain() } }

    override suspend fun createItem(name: String, description: String?): AppResult<Item> =
        safeApiCall { api.create(CreateItemDto(name, description)) }.map { it.toDomain() }

    override suspend fun deleteItem(id: String): AppResult<Unit> =
        safeApiCall { api.delete(id) }
}
