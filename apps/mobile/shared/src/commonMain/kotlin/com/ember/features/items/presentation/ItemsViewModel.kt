package com.ember.features.items.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ember.core.result.AppResult
import com.ember.core.result.toUserMessage
import com.ember.features.items.domain.ItemsRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * MVVM: exposes an immutable [StateFlow] and one function per user intent.
 * Mutations update the list in place instead of reloading it.
 */
class ItemsViewModel(private val repository: ItemsRepository) : ViewModel() {

    private val _state = MutableStateFlow(ItemsUiState())
    val state: StateFlow<ItemsUiState> = _state.asStateFlow()

    /** Current page load; a refresh cancels it so stale responses never win. */
    private var loadJob: Job? = null

    init {
        refresh()
    }

    fun refresh() {
        loadJob?.cancel()
        loadJob = viewModelScope.launch {
            _state.update { it.copy(isLoading = true, isLoadingMore = false, loadError = null) }
            when (val result = repository.getItems(page = 1)) {
                is AppResult.Success -> _state.update {
                    it.copy(
                        items = result.data.items,
                        total = result.data.total,
                        page = result.data.page,
                        isLoading = false,
                    )
                }
                is AppResult.Failure -> _state.update {
                    it.copy(isLoading = false, loadError = result.error.toUserMessage())
                }
            }
        }
    }

    fun loadMore() {
        val current = _state.value
        if (!current.hasMore || current.isLoading || current.isLoadingMore) return
        loadJob = viewModelScope.launch {
            _state.update { it.copy(isLoadingMore = true) }
            when (val result = repository.getItems(page = current.page + 1)) {
                is AppResult.Success -> _state.update { state ->
                    // Items added locally may come back in a later page.
                    val known = state.items.mapTo(mutableSetOf()) { it.id }
                    state.copy(
                        items = state.items + result.data.items.filterNot { it.id in known },
                        total = result.data.total,
                        page = result.data.page,
                        isLoadingMore = false,
                    )
                }
                is AppResult.Failure -> _state.update {
                    it.copy(isLoadingMore = false, message = result.error.toUserMessage())
                }
            }
        }
    }

    fun onDraftChange(value: String) {
        _state.update { it.copy(draft = value) }
    }

    fun add() {
        val name = _state.value.draft.trim()
        if (name.isEmpty() || _state.value.isSubmitting) return
        viewModelScope.launch {
            _state.update { it.copy(isSubmitting = true) }
            when (val result = repository.createItem(name)) {
                is AppResult.Success -> _state.update {
                    it.copy(
                        items = it.items + result.data,
                        total = it.total + 1,
                        draft = "",
                        isSubmitting = false,
                    )
                }
                is AppResult.Failure -> _state.update {
                    it.copy(isSubmitting = false, message = result.error.toUserMessage())
                }
            }
        }
    }

    fun delete(id: String) {
        viewModelScope.launch {
            when (val result = repository.deleteItem(id)) {
                is AppResult.Success -> _state.update { state ->
                    state.copy(items = state.items.filterNot { it.id == id }, total = state.total - 1)
                }
                is AppResult.Failure -> _state.update {
                    it.copy(message = result.error.toUserMessage())
                }
            }
        }
    }

    fun messageShown() {
        _state.update { it.copy(message = null) }
    }
}
