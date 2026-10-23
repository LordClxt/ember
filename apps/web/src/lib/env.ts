/** Typed access to public env vars (prefixed `VITE_`, available on client and server). */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
}
