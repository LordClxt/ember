package com.ember.features.items.presentation

import com.ember.features.items.domain.Item

/**
 * Whole screen state. A failed add/delete never replaces the list: it only
 * sets [message] (shown once as a snackbar) and keeps [draft] so nothing typed is lost.
 */
data class ItemsUiState(
    val items: List<Item> = emptyList(),
    val total: Int = 0,
    val page: Int = 0,
    val isLoading: Boolean = true,
    val isLoadingMore: Boolean = false,
    /** Blocking error: the first page could not be loaded. */
    val loadError: String? = null,
    val draft: String = "",
    val isSubmitting: Boolean = false,
    /** Transient error for an action; cleared by `messageShown()`. */
    val message: String? = null,
) {
    val hasMore: Boolean get() = items.size < total
}
