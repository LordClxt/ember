/**
 * Formats staged files on `git commit` (see `.husky/pre-commit`).
 * Prettier reads the nearest `.prettierrc` (apps/api, apps/web).
 */
export default {
  '*.{js,mjs,cjs,ts,tsx,jsx,json,css,scss,html,yml,yaml}':
    'prettier --write --ignore-unknown',
  // Spotless (ktlint) works on the whole Gradle project, so run it once rather than per file.
  'apps/mobile/**/*.{kt,kts}': () => 'npm run format:kotlin',
};
