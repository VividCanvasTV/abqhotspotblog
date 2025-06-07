#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 App Startup - Database Setup...');

// Check if we have a PostgreSQL DATABASE_URL
const hasDatabaseUrl = process.env.DATABASE_URL;
const isPostgreSQLUrl = hasDatabaseUrl && hasDatabaseUrl.startsWith('postgres');
const isRailwayEnvironment = !!(
  process.env.RAILWAY_ENVIRONMENT || 
  process.env.RAILWAY_PROJECT_ID || 
  process.env.RAILWAY_SERVICE_ID
);

console.log('🔍 Environment check:');
console.log('  - DATABASE_URL:', hasDatabaseUrl ? 'SET' : 'NOT SET');
console.log('  - PostgreSQL URL:', isPostgreSQLUrl);
console.log('  - Railway Environment:', isRailwayEnvironment);

if (isPostgreSQLUrl || isRailwayEnvironment) {
  console.log('🗄️ Setting up PostgreSQL database...');
  
  // Ensure we're using the correct schema
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');
  
  // Check current schema
  if (fs.existsSync(schemaPath)) {
    const currentSchema = fs.readFileSync(schemaPath, 'utf8');
    if (currentSchema.includes('provider = "sqlite"')) {
      console.log('🔄 Converting schema to PostgreSQL...');
      
      if (fs.existsSync(productionSchemaPath)) {
        console.log('📄 Using production schema file...');
        const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
        fs.writeFileSync(schemaPath, productionSchema);
        console.log('✅ Production schema copied to main schema file');
        
        // Regenerate Prisma client with new schema
        console.log('🔄 Regenerating Prisma client...');
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Prisma client regenerated');
      } else {
        console.log('📄 Production schema file not found, converting inline...');
        const updatedSchema = currentSchema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
        fs.writeFileSync(schemaPath, updatedSchema);
        console.log('✅ Schema converted to PostgreSQL');
        
        // Regenerate Prisma client with new schema
        console.log('🔄 Regenerating Prisma client...');
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Prisma client regenerated');
      }
    } else {
      console.log('✅ Schema already using PostgreSQL');
    }
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