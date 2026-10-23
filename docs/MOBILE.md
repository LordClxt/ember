# Mobile — Kotlin Multiplatform

UI **shared** through Compose Multiplatform: the `shared` module holds the logic *and* the screens; `androidApp` and `iosApp` are only entry points.

```
apps/mobile/
├── gradle/libs.versions.toml      # version catalog
├── shared/src/
│   ├── commonMain/kotlin/com/ember/
│   │   ├── App.kt                 # theme + type-safe navigation
│   │   ├── core/
│   │   │   ├── config/AppConfig.kt        # expect defaultApiBaseUrl()
│   │   │   ├── network/HttpClientFactory.kt, SafeApiCall.kt
│   │   │   ├── pagination/Page.kt         # one page of a paginated list
│   │   │   └── result/AppResult.kt        # AppResult / AppError
│   │   ├── di/Koin.kt             # Koin modules
│   │   ├── ui/theme/EmberTheme.kt
│   │   └── features/items/
│   │       ├── data/              # DTOs, ItemsApi (Ktor), ItemsRepositoryImpl
│   │       ├── domain/            # Item, ItemsRepository (interface)
│   │       └── presentation/      # ItemsUiState, ItemsViewModel, ItemsScreen
│   ├── commonTest/                # tests with Ktor MockEngine and fake repositories
│   ├── androidMain/               # Android actuals (emulator URL)
│   └── iosMain/                   # iOS actuals, MainViewController, initKoinIos
├── androidApp/                    # Application + MainActivity
└── iosApp/                        # Xcode project (SwiftUI → ComposeUIViewController)
```

## Light clean architecture

```
Screen ──▶ ViewModel ──▶ Repository (interface, domain) ◀── RepositoryImpl ──▶ Api (Ktor)
            StateFlow<ItemsUiState>    AppResult<T>                  safeApiCall
```

- The **domain** depends on nothing (no Ktor, no serialization).
- **DTOs** are converted to domain models (`toDomain()`) in the data layer. They mirror the types of `packages/contracts` by hand: keep them in sync.
- **Repositories** never throw: they return `AppResult.Success` / `AppResult.Failure`.
- **ViewModels** expose an immutable `StateFlow` of a screen state (`ItemsUiState`). A failed action never replaces the list: it sets a one-off `message` shown as a snackbar.

## Commands

```bash
./gradlew :androidApp:assembleDebug                 # APK
./gradlew :androidApp:installDebug                  # installs on the emulator
./gradlew :shared:testAndroidHostTest               # commonTest tests (JVM)
./gradlew :shared:linkDebugFrameworkIosSimulatorArm64  # iOS framework
./gradlew spotlessApply                             # format (ktlint)
```

iOS: open `iosApp/iosApp.xcodeproj` in Xcode; the build phase calls `:shared:embedAndSignAppleFrameworkForXcode`.

## Adding a feature

1. `features/products/domain/`: model + `ProductsRepository` interface
2. `features/products/data/`: DTOs (mirroring `packages/contracts`), `ProductsApi`, `ProductsRepositoryImpl`
3. `features/products/presentation/`: `ProductsUiState`, `ProductsViewModel`, `ProductsScreen`
4. A `productsModule` Koin module, added to `featureModules`
5. A `@Serializable` destination + `composable<…>` in `App.kt`
6. Tests in `commonTest` (`MockEngine` for the repository, a fake repository for the ViewModel)
