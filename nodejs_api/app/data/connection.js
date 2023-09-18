import { MongoClient } from 'mongodb';

/**
 * Connects to a MongoDB Atlas cluster using the provided URI.
 *
 * @param {string} uri - The URI of the MongoDB Atlas cluster.
 * @return {MongoClient} The connected MongoClient object.
 */
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
