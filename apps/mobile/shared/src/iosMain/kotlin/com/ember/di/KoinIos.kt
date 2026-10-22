package com.ember.di

import com.ember.core.config.AppConfig
import kotlin.experimental.ExperimentalNativeApi

/** Entry point called from Swift: `KoinIosKt.doInitKoinIos()`. */
@OptIn(ExperimentalNativeApi::class)
fun initKoinIos() = initKoin(AppConfig(enableHttpLogs = Platform.isDebugBinary))
