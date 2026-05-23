/**
 * Environment Variables Validator
 * Runs at startup to ensure all critical env vars are present
 * Prevents missing credentials from causing silent failures
 */

function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'DIRECT_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY',
  ];

  const missing = required.filter((variable) => !process.env[variable]);

  if (missing.length > 0) {
    console.error(
      '❌ Missing critical environment variables:',
      missing.join(', ')
    );
    console.error(
      '\n📋 Please copy .env.example to .env.local and fill in your credentials.'
    );
    console.error(
      'ℹ️  Never commit .env or .env.local to git!\n'
    );

    // In production, fail hard
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing environment variables: ${missing.join(', ')}`
      );
    }
  }

  // Warn if using placeholder values
  if (process.env.JWT_SECRET?.includes('your-') || 
      process.env.JWT_SECRET === 'docbook-jwt-secret-key-change-in-production-2024') {
    console.warn(
      '⚠️  WARNING: Using placeholder JWT_SECRET. Please set a strong one!'
    );
  }

  if (process.env.DATABASE_URL?.includes('your_username')) {
    console.warn(
      '⚠️  WARNING: DATABASE_URL contains placeholders. Update .env.local with real credentials!'
    );
  }

  console.log('✅ Environment variables validated successfully\n');
}

export { validateEnvironment };
