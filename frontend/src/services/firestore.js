/**
 * Barrel file — re-exports from focused service modules.
 * Kept for backward compatibility so existing page imports don't break.
 * New code should import directly from './resources', './users', './bookmarks'.
 */
export * from './resources';
export * from './users';
export * from './bookmarks';
