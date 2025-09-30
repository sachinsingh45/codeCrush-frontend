/**
 * API Configuration
 * Automatically detects environment and sets appropriate backend URL
 */

// Detect if running on localhost
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';

// Backend API URL (switches between local and production)
export const BASE_URL = isLocalhost 
  ? "http://localhost:7777" 
  : "https://codecrush2.onrender.com";

// Specific API endpoints
export const CODE_REVIEW_SNIPPETS_URL = `${BASE_URL}/code-review/snippet/all`;

// Environment flags
export const IS_PRODUCTION = !isLocalhost;

// API Configuration
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 3;