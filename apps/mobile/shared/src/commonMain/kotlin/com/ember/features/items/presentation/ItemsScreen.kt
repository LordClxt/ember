package com.ember.features.items.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.ember.features.items.domain.Item
import com.ember.resources.Res
import com.ember.resources.action_add
import com.ember.resources.action_retry
import com.ember.resources.items_add_placeholder
import com.ember.resources.items_empty
import com.ember.resources.items_title
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.filter
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.viewmodel.koinViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemsScreen(viewModel: ItemsViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }

    LaunchedEffect(state.message) {
        state.message?.let {
            snackbar.showSnackbar(it)
            viewModel.messageShown()
        }
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("${stringResource(Res.string.items_title)} (${state.total})") }) },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
            AddItemRow(
                draft = state.draft,
                enabled = !state.isSubmitting,
                onDraftChange = viewModel::onDraftChange,
                onAdd = viewModel::add,
            )
            Box(Modifier.fillMaxSize().padding(top = 16.dp), contentAlignment = Alignment.Center) {
                when {
                    state.isLoading && state.items.isEmpty() -> CircularProgressIndicator()
                    state.loadError != null -> ErrorContent(state.loadError!!, onRetry = viewModel::refresh)
                    else -> ItemsList(
                        items = state.items,
                        isLoadingMore = state.isLoadingMore,
                        hasMore = state.hasMore,
                        onLoadMore = viewModel::loadMore,
                        onDelete = viewModel::delete,
                    )
                }
            }
        }
    }
}

@Composable
private fun AddItemRow(
    draft: String,
    enabled: Boolean,
    onDraftChange: (String) -> Unit,
    onAdd: () -> Unit,
) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = draft,
            onValueChange = onDraftChange,
            placeholder = { Text(stringResource(Res.string.items_add_placeholder)) },
            singleLine = true,
            modifier = Modifier.weight(1f),
        )
        Button(onClick = onAdd, enabled = enabled && draft.isNotBlank()) {
            Text(stringResource(Res.string.action_add))
        }
    }
}

@Composable
private fun ItemsList(
    items: List<Item>,
    isLoadingMore: Boolean,
    hasMore: Boolean,
    onLoadMore: () -> Unit,
    onDelete: (String) -> Unit,
) {
    if (items.isEmpty()) {
        Text(stringResource(Res.string.items_empty), style = MaterialTheme.typography.bodyMedium)
        return
    }
    val listState = rememberLazyListState()
    // Fetch the next page when the last row becomes visible.
    LaunchedEffect(listState, hasMore) {
        snapshotFlow { listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index }
            .distinctUntilChanged()
            .filter { it != null && it >= listState.layoutInfo.totalItemsCount - 1 }
            .collect { if (hasMore) onLoadMore() }
    }
    LazyColumn(Modifier.fillMaxSize(), state = listState) {
        items(items, key = { it.id }) { item ->
            ListItem(
                headlineContent = { Text(item.name) },
                supportingContent = item.description?.let { { Text(it) } },
                trailingContent = { TextButton(onClick = { onDelete(item.id) }) { Text("✕") } },
            )
            HorizontalDivider()
        }
        if (isLoadingMore) {
            item(key = "loading-more") {
                Box(Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            }
        }
    }
}

@Composable
private fun ErrorContent(message: String, onRetry: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Text(message, color = MaterialTheme.colorScheme.error)
        TextButton(onClick = onRetry) { Text(stringResource(Res.string.action_retry)) }
    }
}
