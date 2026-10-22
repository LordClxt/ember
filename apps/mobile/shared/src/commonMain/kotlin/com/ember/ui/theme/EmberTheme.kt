package com.ember.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val Ember = Color(0xFFE4572E)
private val EmberDark = Color(0xFFFF8A65)

private val LightColors = lightColorScheme(primary = Ember, secondary = Color(0xFF29335C))
private val DarkColors = darkColorScheme(primary = EmberDark, secondary = Color(0xFFA9B4E0))

@Composable
fun EmberTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = if (darkTheme) DarkColors else LightColors, content = content)
}
