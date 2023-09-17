import '../utils/env.utils.js'
import { connexion } from './connection.js';

export async function passImportExecution() {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connexion(uri);
    const db = mongoClient.db(process.env.DB_NAME);
    const collection = db.collection('pass');

    const passes = [
      {
        passLevel: 'Not vaccinated',
        createdAt: Date.now(),
        updatedAt: null
      },
      {
        passLevel: 'Recent case of covid',
        createdAt: Date.now(),
        updatedAt: null
      },
      {
        passLevel: 'Vaccinated',
        createdAt: Date.now(),
        updatedAt: null
      }
    ];

    await collection.insertMany(passes);

  } finally {
    await mongoClient.close();
  }
}

passImportExecution();