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
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.ember.core.presentation.UiState
import com.ember.features.items.domain.Item
import com.ember.resources.Res
import com.ember.resources.action_add
import com.ember.resources.action_retry
import com.ember.resources.items_add_placeholder
import com.ember.resources.items_empty
import com.ember.resources.items_title
import org.jetbrains.compose.resources.stringResource
import org.koin.compose.viewmodel.koinViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemsScreen(viewModel: ItemsViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    Scaffold(
        topBar = { TopAppBar(title = { Text(stringResource(Res.string.items_title)) }) },
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
            AddItemRow(onAdd = viewModel::add)
            Box(Modifier.fillMaxSize().padding(top = 16.dp), contentAlignment = Alignment.Center) {
                when (val s = state) {
                    UiState.Loading -> CircularProgressIndicator()
                    is UiState.Error -> ErrorContent(s.message, onRetry = viewModel::refresh)
                    is UiState.Success -> ItemsList(s.data, onDelete = viewModel::delete)
                }
            }
        }
    }
}

@Composable
private fun AddItemRow(onAdd: (String) -> Unit) {
    var name by remember { mutableStateOf("") }
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            placeholder = { Text(stringResource(Res.string.items_add_placeholder)) },
            singleLine = true,
            modifier = Modifier.weight(1f),
        )
        Button(onClick = { onAdd(name); name = "" }, enabled = name.isNotBlank()) {
            Text(stringResource(Res.string.action_add))
        }
    }
}

@Composable
private fun ItemsList(items: List<Item>, onDelete: (String) -> Unit) {
    if (items.isEmpty()) {
        Text(stringResource(Res.string.items_empty), style = MaterialTheme.typography.bodyMedium)
        return
    }
    LazyColumn(Modifier.fillMaxSize()) {
        items(items, key = { it.id }) { item ->
            ListItem(
                headlineContent = { Text(item.name) },
                supportingContent = item.description?.let { { Text(it) } },
                trailingContent = { TextButton(onClick = { onDelete(item.id) }) { Text("✕") } },
            )
            HorizontalDivider()
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
