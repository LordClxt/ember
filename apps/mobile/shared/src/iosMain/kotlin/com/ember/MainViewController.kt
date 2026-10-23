package com.ember

import androidx.compose.ui.window.ComposeUIViewController

// Called from Swift as `MainViewControllerKt.MainViewController()`.
@Suppress("ktlint:standard:function-naming")
fun MainViewController() = ComposeUIViewController { App() }
