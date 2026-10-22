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

fun coreModule(config: AppConfig) = module {
    single { config }
    single { createHttpClient(get()) }
}

val itemsModule = module {
    singleOf(::KtorItemsApi) { bind<ItemsApi>() }
    singleOf(::ItemsRepositoryImpl) { bind<ItemsRepository>() }
    viewModelOf(::ItemsViewModel)
}

val featureModules = listOf(itemsModule)

fun initKoin(config: AppConfig = AppConfig(), appDeclaration: KoinAppDeclaration = {}) {
    startKoin {
        appDeclaration()
        modules(listOf(coreModule(config)) + featureModules)
    }
}
