// ============================================================================
// @tanmayee/api — Environment & Configuration
// ============================================================================

import dotenv from 'dotenv';
import path from 'path';

// Load .env from monorepo root or local directory
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'tanmayee-dev-jwt-super-secret-key-min-32-chars!!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Admin Credentials from Environment
  adminEmail: process.env.ADMIN_EMAIL || 'admin@tanmayeetechnologies.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'tanmayeeprasad1980',

  // Frontend URLs for CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
  allowedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ],
};
