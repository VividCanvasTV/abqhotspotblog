#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 App Startup - Database Setup...');

// Check if we have a PostgreSQL DATABASE_URL
const hasDatabaseUrl = process.env.DATABASE_URL;
const isPostgreSQLUrl = hasDatabaseUrl && hasDatabaseUrl.startsWith('postgres');

if (isPostgreSQLUrl) {
  console.log('🗄️ Setting up PostgreSQL database...');
  
  try {
    // Push database schema (creates tables if they don't exist)
    console.log('📊 Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema updated successfully');
  } catch (error) {
    console.error('❌ Database schema push failed:', error.message);
    console.log('⚠️  App will continue to start, but database may not be properly initialized');
  }
} else {
  console.log('🔧 Using SQLite - no additional setup needed');
}

console.log('✅ Startup setup complete!'); 