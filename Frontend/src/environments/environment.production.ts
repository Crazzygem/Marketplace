export const environment = {
  production: true,
  // Use relative /api for same-origin requests (no CORS issues)
  // This is replaced at build time by Dockerfile, but fallback to relative path
  apiUrl: '/api'
};
