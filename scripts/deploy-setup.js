#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚂 Railway Deployment Setup...');

// Read the current schema.prisma
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

if (isProduction) {
  console.log('📊 Switching to PostgreSQL for production...');
  
  // Replace SQLite with PostgreSQL
  schema = schema.replace(
    /provider = "sqlite"/g,
    'provider = "postgresql"'
  );
  
  // Write the updated schema
  fs.writeFileSync(schemaPath, schema);
  console.log('✅ Database provider updated to PostgreSQL');
} else {
  console.log('🔧 Using SQLite for local development');
}

console.log('✅ Deployment setup complete!'); 