#!/usr/bin/node

const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    
    const db = client.db('mydb');
    console.log(`Connected to database: ${db.databaseName}`);
 
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

main();