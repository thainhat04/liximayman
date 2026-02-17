import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import redEnvelopeRoutes, { setStorage } from './routes/redEnvelopeRoutes';
import { initDatabase, testConnection } from './database/init';
import databaseStorage from './storage/DatabaseStorage';
import inMemoryStorage from './storage/InMemoryStorage';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/red-envelopes', redEnvelopeRoutes);

// Health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({ 
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
async function startServer() {
  let isDatabaseConnected = false;
  
  try {
    // Test database connection
    isDatabaseConnected = await testConnection();
    
    if (!isDatabaseConnected) {
      console.warn('⚠️  Cannot connect to database.');
      console.warn('📖 Please check DATABASE_SETUP.md for troubleshooting.');
      console.warn('💡 Using in-memory storage as fallback.');
      console.warn('⚠️  Data will be lost on server restart!');
      setStorage(inMemoryStorage);
    } else {
      // Initialize database schema
      await initDatabase();
      setStorage(databaseStorage);
    }
  } catch (error) {
    console.error('⚠️  Error connecting to database:', error);
    console.warn('💡 Falling back to in-memory storage');
    isDatabaseConnected = false;
    setStorage(inMemoryStorage);
  }
  
  // Start server regardless of database status
  app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('🚀 Server is running');
    console.log('═══════════════════════════════════════════');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🗄️  Storage: ${isDatabaseConnected ? 'PostgreSQL ✅' : 'In-Memory ⚠️'}`);
    if (!isDatabaseConnected) {
      console.log(`⚠️  WARNING: Using in-memory storage - data will be lost on restart`);
    }
    console.log('═══════════════════════════════════════════');
    console.log('');
  });
}

startServer();
