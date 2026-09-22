// ============================================================================
// @tanmayee/api — Server Entry Point
// ============================================================================

import { createApp } from './app';
import { config } from './config/env';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 Tanmayee Technologies API Server is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🩺 Health Check: http://localhost:${config.port}/api/health`);
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
