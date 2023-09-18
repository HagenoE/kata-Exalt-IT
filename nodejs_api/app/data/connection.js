import { MongoClient } from 'mongodb';

export default async function connexion(uri) {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri);
    console.log('Connecting to MongoDB Atlas cluster...');
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.error('Connection to MongoDB Atlas failed!', error);
    process.exit();
  }
  return mongoClient;
}
