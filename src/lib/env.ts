/**
 * Environment variables helper for Midnight Explorer
 * Provides safe access to configuration values with defaults
 */

/**
 * Application environment types
 */
export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

/**
 * Current application environment
 * Set via NEXT_PUBLIC_ENVIRONMENT environment variable
 * Defaults to development if not specified
 */
export const APP_ENVIRONMENT = (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment) || Environment.DEVELOPMENT;

/**
 * URL for the Midnight indexer API
 * Set via NEXT_PUBLIC_INDEXER_URL environment variable
 */
export const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL || "";

/**
 * Flag to determine if mock data should be used
 * Set to false only when USE_MOCK_DATA="0" is explicitly configured
 * Defaults to true for easier development without endpoints
 */
export const USE_MOCK = process.env.USE_MOCK_DATA !== "0";
