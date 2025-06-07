#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚂 Railway Deployment Setup...');

// Check if we're in production environment or have DATABASE_URL
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
const hasDatabaseUrl = process.env.DATABASE_URL;
const isPostgreSQLUrl = hasDatabaseUrl && hasDatabaseUrl.startsWith('postgres');

if (isProduction && isPostgreSQLUrl) {
  console.log('📊 Switching to PostgreSQL for production...');
  
  // Read the current schema.prisma
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace SQLite with PostgreSQL
  schema = schema.replace(
    /provider = "sqlite"/g,
    'provider = "postgresql"'
  );
  
  // Write the updated schema
  fs.writeFileSync(schemaPath, schema);
  console.log('✅ Database provider updated to PostgreSQL');
  
  // Run Prisma commands for production
  try {
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('🗄️ Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
} else if (isProduction && !isPostgreSQLUrl) {
  console.log('⚠️  Production build with SQLite - keeping SQLite for local builds');
  console.log('✅ This is normal for local development builds');
} else {
  console.log('🔧 Using SQLite for local development');
}

console.log('✅ Deployment setup complete!'); 