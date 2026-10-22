# Mobile — Kotlin Multiplatform

UI **partagée** avec Compose Multiplatform : le module `shared` contient la logique *et* les écrans ; `androidApp` et `iosApp` ne sont que des points d'entrée.

```
apps/mobile/
├── gradle/libs.versions.toml      # catalogue de versions
├── shared/src/
│   ├── commonMain/kotlin/com/ember/
│   │   ├── App.kt                 # thème + navigation type-safe
│   │   ├── core/
│   │   │   ├── config/AppConfig.kt        # expect defaultApiBaseUrl()
│   │   │   ├── network/HttpClientFactory.kt, SafeApiCall.kt
│   │   │   ├── presentation/UiState.kt
│   │   │   └── result/AppResult.kt        # AppResult / AppError
│   │   ├── di/Koin.kt             # modules Koin
│   │   ├── ui/theme/EmberTheme.kt
│   │   └── features/items/
│   │       ├── data/              # DTO, ItemsApi (Ktor), ItemsRepositoryImpl
│   │       ├── domain/            # Item, ItemsRepository (interface)
│   │       └── presentation/      # ItemsViewModel, ItemsScreen
│   ├── commonTest/                # tests avec Ktor MockEngine
│   ├── androidMain/               # actual Android (URL émulateur)
│   └── iosMain/                   # actual iOS, MainViewController, initKoinIos
├── androidApp/                    # Application + MainActivity
└── iosApp/                        # projet Xcode (SwiftUI → ComposeUIViewController)
```

## Clean architecture légère

```
Screen ──▶ ViewModel ──▶ Repository (interface, domain) ◀── RepositoryImpl ──▶ Api (Ktor)
            StateFlow<UiState>         AppResult<T>                  safeApiCall
```

- Le **domaine** ne dépend de rien (pas de Ktor, pas de sérialisation).
- Les **DTO** sont convertis en modèles domaine (`toDomain()`) dans la couche data.
- Les **repositories** ne lèvent pas d'exceptions : ils renvoient `AppResult.Success` / `AppResult.Failure`.
- Les **ViewModels** exposent un `StateFlow<UiState<T>>` immuable.

## Commandes

```bash
./gradlew :androidApp:assembleDebug                 # APK
./gradlew :androidApp:installDebug                  # installe sur l'émulateur
./gradlew :shared:testAndroidHostTest               # tests commonTest (JVM)
./gradlew :shared:linkDebugFrameworkIosSimulatorArm64  # framework iOS
```

iOS : ouvre `iosApp/iosApp.xcodeproj` dans Xcode ; la build phase appelle `:shared:embedAndSignAppleFrameworkForXcode`.

## Ajouter une feature

1. `features/products/domain/` : modèle + interface `ProductsRepository`
2. `features/products/data/` : DTO, `ProductsApi`, `ProductsRepositoryImpl`
3. `features/products/presentation/` : `ProductsViewModel`, `ProductsScreen`
4. Un module Koin `productsModule`, ajouté à `appModules`
5. Une destination `@Serializable` + `composable<…>` dans `App.kt`
6. Un test dans `commonTest` avec `MockEngine`
