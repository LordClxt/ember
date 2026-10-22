# Contribuer

1. Crée une branche depuis `main` (`feat/…`, `fix/…`).
2. Respecte les [conventions](docs/CONVENTIONS.md).
3. Vérifie localement :
   ```bash
   npm run lint && npm test
   (cd apps/mobile && ./gradlew :shared:testAndroidHostTest)
   ```
4. Ouvre une PR en remplissant le template. La CI (API, Web, Android, iOS) doit être verte.
