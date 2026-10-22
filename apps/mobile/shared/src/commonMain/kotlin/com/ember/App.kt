package com.ember

import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.ember.features.items.presentation.ItemsScreen
import com.ember.ui.theme.EmberTheme
import kotlinx.serialization.Serializable

/** Type-safe navigation destinations. Add one object/data class per screen. */
@Serializable
object ItemsDestination

@Composable
fun App() {
    EmberTheme {
        Surface {
            val navController = rememberNavController()
            NavHost(navController = navController, startDestination = ItemsDestination) {
                composable<ItemsDestination> { ItemsScreen() }
            }
        }
    }
}
