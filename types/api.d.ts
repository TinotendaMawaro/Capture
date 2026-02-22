/**
 * Shared TypeScript interfaces for API responses
 */

// Generic response wrapper interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Count response interface  
export interface ApiCountResponse extends ApiResponse {
  count?: number;
}

// Activity log action types
export type ActivityAction = 'create' | 'update' | 'delete';

// Entity names used in activity logging  
export type EntityType = 'member' | 'deacon' | 'pastor' | 'zone' | 'region' | 'department';

// Helper function to extract error message safely from unknown errors
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return String(err);
}
