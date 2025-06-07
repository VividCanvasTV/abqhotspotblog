#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚂 Railway Deployment Setup...');

// Check if we're in Railway environment (during build DATABASE_URL might not be available)
const isRailwayBuild = !!(
  process.env.RAILWAY_ENVIRONMENT || 
  process.env.RAILWAY_PROJECT_ID || 
  process.env.RAILWAY_SERVICE_ID ||
  process.env.RAILWAY_PUBLIC_DOMAIN ||
  process.env.RAILWAY_STATIC_URL
);
const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = process.env.DATABASE_URL;
const isPostgreSQLUrl = hasDatabaseUrl && hasDatabaseUrl.startsWith('postgres');

console.log('🔍 Environment detection:');
console.log('  - RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('  - RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('  - RAILWAY_SERVICE_ID:', process.env.RAILWAY_SERVICE_ID ? 'SET' : 'NOT SET');
console.log('  - isRailwayBuild:', isRailwayBuild);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - DATABASE_URL:', hasDatabaseUrl ? 'SET' : 'NOT SET');

// Switch to PostgreSQL if we're in Railway environment (even without DATABASE_URL during build)
if (isRailwayBuild || (isProduction && isPostgreSQLUrl)) {
  console.log('📊 Switching to PostgreSQL for production...');
  
  // Use the production schema file
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');
  
  if (fs.existsSync(productionSchemaPath)) {
    console.log('📄 Using production schema file...');
    const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
    fs.writeFileSync(schemaPath, productionSchema);
    console.log('✅ Production schema copied to main schema file');
  } else {
    console.log('📄 Production schema file not found, converting inline...');
    // Fallback to inline conversion
    let schema = fs.readFileSync(schemaPath, 'utf8');
    schema = schema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ Database provider updated to PostgreSQL');
  }
  
  // Generate Prisma client for production
  try {
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    console.log('ℹ️  Database schema will be pushed after deployment starts');
  } catch (error) {
    console.error('❌ Prisma client generation failed:', error.message);
    process.exit(1);
  }
} else if (isProduction && !isRailwayBuild) {
  console.log('⚠️  Production build detected but not Railway - forcing PostgreSQL anyway');
  console.log('📊 Switching to PostgreSQL for production build...');
  
  // Force PostgreSQL for any production build
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');
  
  if (fs.existsSync(productionSchemaPath)) {
    console.log('📄 Using production schema file...');
    const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
    fs.writeFileSync(schemaPath, productionSchema);
    console.log('✅ Production schema copied to main schema file');
  } else {
    // Fallback to inline conversion
    let schema = fs.readFileSync(schemaPath, 'utf8');
    schema = schema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ Database provider updated to PostgreSQL');
  }
  
  // Generate Prisma client for production
  try {
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
  } catch (error) {
    console.error('❌ Prisma client generation failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('🔧 Using SQLite for local development');
}

console.log('✅ Deployment setup complete!'); 