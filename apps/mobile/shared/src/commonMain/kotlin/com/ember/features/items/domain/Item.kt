package com.ember.features.items.domain

/** Domain model — what the UI works with. Decoupled from the API DTO. */
data class Item(
    val id: String,
    val name: String,
    val description: String?,
)
