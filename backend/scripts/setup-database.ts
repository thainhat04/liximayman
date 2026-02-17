import 'dotenv/config';
import { initDatabase, testConnection } from '../src/database/init';

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    console.log(`📍 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`📦 Database: ${process.env.DB_NAME}`);
    console.log('');
    
    // Test connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Cannot connect to database');
      console.error('Please check your database configuration in .env file');
      process.exit(1);
    }
    
    // Initialize schema
    await initDatabase();
    
    console.log('');
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('You can now start the server with:');
    console.log('  npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
