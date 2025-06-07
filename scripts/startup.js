#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 App Startup - Database Setup...');

// Check if we have a PostgreSQL DATABASE_URL
const hasDatabaseUrl = process.env.DATABASE_URL;
const isPostgreSQLUrl = hasDatabaseUrl && hasDatabaseUrl.startsWith('postgres');

if (isPostgreSQLUrl) {
  console.log('🗄️ Setting up PostgreSQL database...');
  
  // First, ensure schema is set to PostgreSQL at startup
  console.log('📊 Converting schema to PostgreSQL...');
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  if (schema.includes('provider = "sqlite"')) {
    schema = schema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ Schema converted to PostgreSQL');
    
    // Regenerate Prisma client with PostgreSQL schema
    console.log('📦 Regenerating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client regenerated');
  } else {
    console.log('✅ Schema already using PostgreSQL');
  }
  
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