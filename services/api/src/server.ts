// ============================================================================
// @tanmayee/api — Server Entry Point
// ============================================================================

import { createApp } from './app';
import { config } from './config/env';

const app = createApp();

// Catch uncaught errors to prevent silent exits
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Tanmayee Technologies API Server is running!`);
  console.log(`📡 URL: http://0.0.0.0:${config.port}`);
  console.log(`🩺 Health Check: http://0.0.0.0:${config.port}/api/health`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
  console.log(`====================================================`);
});

// Graceful shutdown
function handleShutdown(signal: string) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if hanging
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
