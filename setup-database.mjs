import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error('❌ POSTGRES_URL_NON_POOLING environment variable is not set');
  process.exit(1);
}

console.log('🔌 Connecting to Supabase database...');
const sql = postgres(connectionString, { ssl: 'require' });

async function checkTableExists(tableName) {
  const result = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    );
  `;
  return result[0].exists;
}

async function executeSQL(sqlScript, description) {
  try {
    console.log(`📝 Executing: ${description}...`);
    await sql.unsafe(sqlScript);
    console.log(`✅ ${description} completed`);
  } catch (error) {
    if (error.code === '42710' || error.code === '42P07') {
      console.log(`⚠️  ${description} - ${error.message} (skipping)`);
    } else {
      console.error(`❌ Error in ${description}:`, error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log('\n📊 Checking existing tables...\n');
    
    const tables = ['profiles', 'categories', 'products', 'orders', 'order_items', 
                   'cart_items', 'wishlist_items', 'product_reviews', 
                   'real_estate_properties', 'real_estate_bookings',
                   'coupons', 'notifications', 'hire_bookings'];
    
    const existingTables = [];
    const missingTables = [];
    
    for (const table of tables) {
      const exists = await checkTableExists(table);
      if (exists) {
        existingTables.push(table);
        console.log(`✅ Table '${table}' exists`);
      } else {
        missingTables.push(table);
        console.log(`⚠️  Table '${table}' is missing`);
      }
    }
    
    console.log(`\n📈 Status: ${existingTables.length}/${tables.length} tables exist\n`);
    
    const scriptsDir = path.join(__dirname, 'scripts');
    const sqlFiles = [
      'create-coupons-table.sql',
      'create-notifications-table.sql',
      '08-seed-new-categories.sql',
      '09-seed-new-products.sql',
      '10-add-wines-body-creams-categories.sql',
      '11-seed-wines-body-creams-products.sql',
      '13-setup-admin-user.sql'
    ];
    
    console.log('🚀 Executing SQL scripts...\n');
    
    for (const file of sqlFiles) {
      const filePath = path.join(scriptsDir, file);
      if (fs.existsSync(filePath)) {
        const sqlScript = fs.readFileSync(filePath, 'utf8');
        await executeSQL(sqlScript, `Script: ${file}`);
      } else {
        console.log(`⚠️  Skipping ${file} (file not found)`);
      }
    }
    
    console.log('\n✨ Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Sign up at /auth to create your admin account (talktostevenson@gmail.com)');
    console.log('2. Access the admin dashboard at /admin');
    console.log('3. Start managing your products and properties\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
