/** Injection token for the active {@link DatabaseConnection}: `@Inject(DATABASE)`. */
export const DATABASE = Symbol('DATABASE');

export const DATABASE_PROVIDERS = ['sqlite', 'postgres', 'mysql'] as const;
