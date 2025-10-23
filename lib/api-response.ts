/**
 * Standardized API response utilities
 * Provides consistent error handling and response formats across all API routes
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  timestamp: string;
  code?: string;
}

export class ApiResponseHandler {
  /**
   * Create a successful response
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an error response
   */
  static error(
    error: string,
    message?: string,
    code?: string
  ): ApiError {
    return {
      success: false,
      error,
      message,
      code,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle validation errors
   */
  static validationError(field: string, message?: string): ApiError {
    return this.error(
      `Validation failed for field: ${field}`,
      message || `Invalid value provided for ${field}`,
      'VALIDATION_ERROR'
    );
  }

  /**
   * Handle authentication errors
   */
  static authError(message?: string): ApiError {
    return this.error(
      'Authentication required',
      message || 'Please sign in to access this resource',
      'AUTH_ERROR'
    );
  }

  /**
   * Handle authorization errors
   */
  static forbiddenError(message?: string): ApiError {
    return this.error(
      'Access forbidden',
      message || 'You do not have permission to access this resource',
      'FORBIDDEN'
    );
  }

  /**
   * Handle rate limiting errors
   */
  static rateLimitError(message?: string): ApiError {
    return this.error(
      'Rate limit exceeded',
      message || 'Too many requests. Please try again later.',
      'RATE_LIMIT'
    );
  }

  /**
   * Handle external service errors
   */
  static externalServiceError(service: string, message?: string): ApiError {
    return this.error(
      `External service error: ${service}`,
      message || `${service} is temporarily unavailable`,
      'EXTERNAL_SERVICE_ERROR'
    );
  }

  /**
   * Handle internal server errors
   */
  static internalError(message?: string): ApiError {
    return this.error(
      'Internal server error',
      message || 'An unexpected error occurred',
      'INTERNAL_ERROR'
    );
  }
}

/**
 * Input validation utilities
 */
export class InputValidator {
  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate required fields
   */
  static validateRequired(fields: Record<string, any>): string[] {
    const errors: string[] = [];
    
    for (const [field, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === '') {
        errors.push(`${field} is required`);
      }
    }
    
    return errors;
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate string length
   */
  static validateLength(input: string, min: number, max: number): boolean {
    return input.length >= min && input.length <= max;
  }
}
