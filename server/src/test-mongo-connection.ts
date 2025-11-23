import 'dotenv/config';
import mongoose from 'mongoose';

async function testMongoConnection() {
  const mongoURI =
    process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

  console.log('Testing MongoDB connection...');
  console.log(`Connection URI: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials if present

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully!');

    // Test the connection by checking if we can access the database
    const db = mongoose.connection.db;
    if (db) {
      const adminDb = db.admin();
      const serverStatus = await adminDb.serverStatus();
      console.log('✅ Database server status retrieved successfully');
      console.log(`   MongoDB version: ${serverStatus.version}`);
      console.log(`   Database name: ${mongoose.connection.name}`);

      // List collections to verify we can interact with the database
      const collections = await db.listCollections().toArray();
      console.log(`✅ Found ${collections.length} collection(s) in database`);
    } else {
      console.log('⚠️  Database object not available');
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

testMongoConnection();

