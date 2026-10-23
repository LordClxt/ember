# Contributing

1. Create a branch from `main` (`feat/…`, `fix/…`), then run `bun install` at the root: it installs the Git hooks (Husky).
2. Follow the [conventions](docs/CONVENTIONS.md). Everything is written in English.
3. Check locally:
   ```bash
   bun run lint && bun run test
   (cd apps/mobile && ./gradlew :shared:testAndroidHostTest)
   ```
4. Open a PR and fill in the template. CI (API, web, Android, iOS) must be green.

## Formatting

| Language | Tool | Config |
|----------|------|--------|
| TS, JS, JSON, YAML, CSS, HTML | Prettier | nearest `.prettierrc` / `prettier.config.js` (root, `apps/api`, `apps/web`) |
| Kotlin (`.kt`, `.kts`) | ktlint via Spotless | `apps/mobile/.editorconfig` (`intellij_idea` style, same as Android Studio) |

The Git hooks take care of it:

- **`git commit`**: `lint-staged` formats the staged files (Spotless runs when a Kotlin file is staged, which needs a JDK).
- **`git push`**: `bun run format:check` blocks the push if a file is not formatted (for example after `--no-verify`).

By hand:

```bash
bun run format               # Prettier + Spotless
bun run format:check         # Prettier check (also in CI)
bun run format:kotlin:check  # Kotlin check (also in CI, android job)
```
