package com.ember.di

import com.ember.core.config.AppConfig
import com.ember.core.network.createHttpClient
import com.ember.features.items.data.ItemsApi
import com.ember.features.items.data.ItemsRepositoryImpl
import com.ember.features.items.data.KtorItemsApi
import com.ember.features.items.domain.ItemsRepository
import com.ember.features.items.presentation.ItemsViewModel
import org.koin.core.context.startKoin
import org.koin.core.module.dsl.bind
import org.koin.core.module.dsl.singleOf
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.KoinAppDeclaration
import org.koin.dsl.module

val coreModule = module {
    single { AppConfig() }
    single { createHttpClient(get()) }
}

val itemsModule = module {
    singleOf(::KtorItemsApi) { bind<ItemsApi>() }
    singleOf(::ItemsRepositoryImpl) { bind<ItemsRepository>() }
    viewModelOf(::ItemsViewModel)
}

val appModules = listOf(coreModule, itemsModule)

fun initKoin(appDeclaration: KoinAppDeclaration = {}) {
    startKoin {
        appDeclaration()
        modules(appModules)
    }
}
