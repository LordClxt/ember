package com.ember.features.items.data

import com.ember.features.items.domain.Item
import kotlinx.serialization.Serializable

@Serializable
data class ItemDto(
    val id: String,
    val name: String,
    val description: String? = null,
    val createdAt: String,
    val updatedAt: String,
)

@Serializable
data class CreateItemDto(
    val name: String,
    val description: String? = null,
)

@Serializable
data class PaginationMetaDto(
    val page: Int,
    val limit: Int,
    val total: Int,
)

@Serializable
data class PaginatedDto<T>(
    val data: List<T>,
    val meta: PaginationMetaDto,
)

fun ItemDto.toDomain() = Item(id = id, name = name, description = description)
