/**
 * Base Controller
 * 
 * This abstract class provides common controller functionality.
 * Controllers handle the business logic and coordinate between models and views.
 */

export abstract class BaseController {
  /**
   * Handle errors in a consistent way
   */
  protected handleError(error: unknown): { error: string } {
    console.error('Controller error:', error);
    
    if (error instanceof Error) {
      return { error: error.message };
    }
    
    return { error: 'An unknown error occurred' };
  }

  /**
   * Validate required fields
   */
  protected validateRequired(
    data: Record<string, any>,
    fields: string[]
  ): { valid: boolean; missing: string[] } {
    const missing = fields.filter(field => !data[field]);
    
    return {
      valid: missing.length === 0,
      missing,
    };
  }
}
