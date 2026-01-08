/**
 * Cookie Service
 * 
 * Note: Authentication cookies (access/refresh tokens) are handled by better-auth.
 * This module provides general cookie utilities for the application.
 * 
 * For token-related cookie operations, use the better-auth middleware.
 */

// Cookie options interface for Elysia
export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  expires?: Date;
  maxAge?: number;
}

/**
 * Set a generic cookie on the response context
 * @param context - Elysia context
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options
 */
export function setCookie(
  context: any,
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  context.setCookie(name, value, options);
}

/**
 * Get a cookie from the request
 * @param context - Elysia context
 * @param name - Cookie name
 * @returns Cookie value or undefined
 */
export function getCookie(context: any, name: string): string | undefined {
  return context.cookie[name];
}

/**
 * Delete a cookie from the response
 * @param context - Elysia context
 * @param name - Cookie name
 * @param options - Cookie options (should match original cookie options)
 */
export function deleteCookie(
  context: any,
  name: string,
  options: CookieOptions = {},
) {
  context.setCookie(name, "", { ...options, maxAge: 0 });
}
