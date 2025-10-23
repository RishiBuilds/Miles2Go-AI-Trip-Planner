/**
 * Environment variable validation utility
 * Ensures all required environment variables are present at startup
 */

interface EnvConfig {
  // Required environment variables
  NEXT_PUBLIC_CONVEX_URL: string;
  OPENROUTER_API_KEY: string;
  GOOGLE_PLACES_API_KEY: string;
  ARCJET_KEY: string;
  
  // Optional environment variables with defaults
  NODE_ENV?: string;
  CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
}

class EnvValidator {
  private config: Partial<EnvConfig> = {};
  private errors: string[] = [];

  constructor() {
    this.validate();
  }


  
  private validate(): void {
    // Required variables
    const requiredVars: (keyof EnvConfig)[] = [
      'NEXT_PUBLIC_CONVEX_URL',
      'OPENROUTER_API_KEY', 
      'GOOGLE_PLACES_API_KEY',
      'ARCJET_KEY'
    ];

    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (!value || value.trim() === '') {
        this.errors.push(`Missing required environment variable: ${varName}`);
      } else {
        this.config[varName] = value;
      }
    }

    // Optional variables with defaults
    this.config.NODE_ENV = process.env.NODE_ENV || 'development';
    this.config.CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
    this.config.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

    // Validate specific formats
    this.validateUrl('NEXT_PUBLIC_CONVEX_URL', this.config.NEXT_PUBLIC_CONVEX_URL);
    this.validateApiKey('OPENROUTER_API_KEY', this.config.OPENROUTER_API_KEY);
    this.validateApiKey('GOOGLE_PLACES_API_KEY', this.config.GOOGLE_PLACES_API_KEY);
    this.validateApiKey('ARCJET_KEY', this.config.ARCJET_KEY);

    if (this.errors.length > 0) {
      console.error('❌ Environment validation failed:');
      this.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error(`Environment validation failed: ${this.errors.join(', ')}`);
    }
  }

  private validateUrl(varName: string, value: string | undefined): void {
    if (!value) return;
    
    try {
      new URL(value);
    } catch {
      this.errors.push(`Invalid URL format for ${varName}: ${value}`);
    }
  }

  private validateApiKey(varName: string, value: string | undefined): void {
    if (!value) return;
    
    if (value.length < 10) {
      this.errors.push(`API key too short for ${varName} (minimum 10 characters)`);
    }
  }

  public getConfig(): EnvConfig {
    return this.config as EnvConfig;
  }

  public isValid(): boolean {
    return this.errors.length === 0;
  }

  public getErrors(): string[] {
    return [...this.errors];
  }
}

// Create singleton instance
const envValidator = new EnvValidator();

export default envValidator;
export const env = envValidator.getConfig();
