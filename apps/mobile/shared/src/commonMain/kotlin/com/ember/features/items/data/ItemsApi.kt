package com.ember.features.items.data

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody

/** Remote data source: thin HTTP mapping of the NestJS `/items` endpoints. */
interface ItemsApi {
    suspend fun list(page: Int, limit: Int): PaginatedDto<ItemDto>
    suspend fun create(body: CreateItemDto): ItemDto
    suspend fun delete(id: String)
}

class KtorItemsApi(private val client: HttpClient) : ItemsApi {
    override suspend fun list(page: Int, limit: Int): PaginatedDto<ItemDto> =
        client.get("items") {
            parameter("page", page)
            parameter("limit", limit)
        }.body()

    override suspend fun create(body: CreateItemDto): ItemDto =
        client.post("items") { setBody(body) }.body()

    override suspend fun delete(id: String) {
        client.delete("items/$id")
    }
}
