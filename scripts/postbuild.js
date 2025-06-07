#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Post-build setup...');

// Always generate Prisma client
console.log('📦 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Only push database schema if DATABASE_URL exists
if (process.env.DATABASE_URL) {
  console.log('🗄️ Pushing database schema...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema pushed');
  } catch (error) {
    console.error('❌ Failed to push database schema:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠️  Skipping database push - no DATABASE_URL found');
  console.log('✅ This is normal for local builds');
}

console.log('🎉 Post-build setup complete!'); 