package com.ember.features.items.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ember.core.presentation.UiState
import com.ember.core.result.AppResult
import com.ember.core.result.toUserMessage
import com.ember.features.items.domain.Item
import com.ember.features.items.domain.ItemsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** MVVM: exposes an immutable [StateFlow] and one function per user intent. */
class ItemsViewModel(private val repository: ItemsRepository) : ViewModel() {

    private val _state = MutableStateFlow<UiState<List<Item>>>(UiState.Loading)
    val state: StateFlow<UiState<List<Item>>> = _state.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _state.value = UiState.Loading
            _state.value = when (val result = repository.getItems()) {
                is AppResult.Success -> UiState.Success(result.data)
                is AppResult.Failure -> UiState.Error(result.error.toUserMessage())
            }
        }
    }

    fun add(name: String) {
        if (name.isBlank()) return
        viewModelScope.launch {
            when (val result = repository.createItem(name.trim())) {
                is AppResult.Success -> refresh()
                is AppResult.Failure -> _state.value = UiState.Error(result.error.toUserMessage())
            }
        }
    }

    fun delete(id: String) {
        viewModelScope.launch {
            when (val result = repository.deleteItem(id)) {
                is AppResult.Success -> refresh()
                is AppResult.Failure -> _state.value = UiState.Error(result.error.toUserMessage())
            }
        }
    }
}
