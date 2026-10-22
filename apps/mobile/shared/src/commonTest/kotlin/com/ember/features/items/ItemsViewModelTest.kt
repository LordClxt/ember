package com.ember.features.items

import com.ember.core.pagination.Page
import com.ember.core.result.AppError
import com.ember.core.result.AppResult
import com.ember.features.items.domain.Item
import com.ember.features.items.domain.ItemsRepository
import com.ember.features.items.presentation.ItemsViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull

@OptIn(ExperimentalCoroutinesApi::class)
class ItemsViewModelTest {
    private class FakeItemsRepository(total: Int) : ItemsRepository {
        val stored = MutableList(total) { Item(id = "$it", name = "Item $it", description = null) }
        var failWrites = false

        override suspend fun getItems(page: Int, limit: Int): AppResult<Page<Item>> =
            AppResult.Success(Page(stored.drop((page - 1) * limit).take(limit), page, limit, stored.size))

        override suspend fun createItem(name: String, description: String?): AppResult<Item> =
            if (failWrites) AppResult.Failure(AppError.Http(400, "name too long"))
            else AppResult.Success(Item("new", name, description).also { stored += it })

        override suspend fun deleteItem(id: String): AppResult<Unit> =
            if (failWrites) AppResult.Failure(AppError.Http(404, "Item $id not found"))
            else AppResult.Success(Unit).also { stored.removeAll { it.id == id } }
    }

    @BeforeTest
    fun setUp() = Dispatchers.setMain(UnconfinedTestDispatcher())

    @AfterTest
    fun tearDown() = Dispatchers.resetMain()

    @Test
    fun loadsFirstPageThenMore() = runTest {
        val viewModel = ItemsViewModel(FakeItemsRepository(total = 25))

        assertEquals(20, viewModel.state.value.items.size)
        assertEquals(25, viewModel.state.value.total)

        viewModel.loadMore()

        assertEquals(25, viewModel.state.value.items.size)
        assertFalse(viewModel.state.value.hasMore)
    }

    @Test
    fun addAppendsLocallyAndClearsDraft() = runTest {
        val viewModel = ItemsViewModel(FakeItemsRepository(total = 1))

        viewModel.onDraftChange("  New  ")
        viewModel.add()

        val state = viewModel.state.value
        assertEquals(listOf("Item 0", "New"), state.items.map { it.name })
        assertEquals(2, state.total)
        assertEquals("", state.draft)
    }

    @Test
    fun failedWritesKeepListAndDraft() = runTest {
        val repository = FakeItemsRepository(total = 1).apply { failWrites = true }
        val viewModel = ItemsViewModel(repository)

        viewModel.onDraftChange("Too long")
        viewModel.add()

        var state = viewModel.state.value
        assertEquals(1, state.items.size)
        assertEquals("Too long", state.draft)
        assertEquals("name too long", state.message)
        assertNull(state.loadError)

        viewModel.messageShown()
        viewModel.delete("0")

        state = viewModel.state.value
        assertEquals(1, state.items.size)
        assertEquals("Item 0 not found", state.message)
    }

    @Test
    fun deleteRemovesLocally() = runTest {
        val viewModel = ItemsViewModel(FakeItemsRepository(total = 2))

        viewModel.delete("0")

        assertEquals(listOf("1"), viewModel.state.value.items.map { it.id })
        assertEquals(1, viewModel.state.value.total)
    }
}
