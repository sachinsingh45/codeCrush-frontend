export const BASE_URL = "http://localhost:7777";
// export const BASE_URL = "https://codecrush2.onrender.com";
export const CODE_REVIEW_SNIPPETS_URL = `${BASE_URL}/code-review/snippet/all`;

// Production configuration
export const IS_PRODUCTION = window.location.hostname !== 'localhost';
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 3;