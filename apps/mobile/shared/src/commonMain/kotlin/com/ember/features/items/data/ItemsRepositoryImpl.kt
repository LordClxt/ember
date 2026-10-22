package com.ember.features.items.data

import com.ember.core.network.safeApiCall
import com.ember.core.pagination.Page
import com.ember.core.result.AppResult
import com.ember.core.result.map
import com.ember.features.items.domain.Item
import com.ember.features.items.domain.ItemsRepository

class ItemsRepositoryImpl(private val api: ItemsApi) : ItemsRepository {
    override suspend fun getItems(page: Int, limit: Int): AppResult<Page<Item>> =
        safeApiCall { api.list(page, limit) }.map { dto ->
            Page(
                items = dto.data.map { it.toDomain() },
                page = dto.meta.page,
                limit = dto.meta.limit,
                total = dto.meta.total,
            )
        }

    override suspend fun createItem(name: String, description: String?): AppResult<Item> =
        safeApiCall { api.create(CreateItemDto(name, description)) }.map { it.toDomain() }

    override suspend fun deleteItem(id: String): AppResult<Unit> =
        safeApiCall { api.delete(id) }
}
