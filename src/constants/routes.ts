/**
 * Application routes constants
 * Centralized route definitions to avoid hardcoding and prevent typos
 */

export const ROUTES = {
  // Public routes
  AUTH: '/auth',

  // Protected routes
  DASHBOARD: '/dashboard',
  QUIZ: '/quiz',
  HISTORY: '/history',
  ANALYTICS: '/analytics',
  QUESTS: '/quests',
} as const;

/**
 * List of protected routes that require authentication
 * Used by middleware to check if user has access
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.QUIZ,
  ROUTES.HISTORY,
  ROUTES.ANALYTICS,
  ROUTES.QUESTS,
] as const;

/**
 * Default redirect route after successful authentication
 */
export const DEFAULT_AUTH_REDIRECT = ROUTES.DASHBOARD;

/**
 * Route for unauthenticated users
 */
export const DEFAULT_UNAUTH_REDIRECT = ROUTES.AUTH;
