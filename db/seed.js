// inside db/seed.js

// grab our client with destructuring from the export in index.js
const { client } = require('./index');

async function testDB() {
  try {
    
    // connect the client to the database, finally
    client.connect();

    // queries are promises, so we can await them
    const { rows } = await client.query(`SELECT * FROM users;`);

    // for now, logging is a fine way to see what's up
    console.log(rows);
    // console.log("test");
  } catch (error) {
    console.error(error);
  } finally {
    // it's important to close out the client connection
    client.end();
  }
}

const {
  // client,
  getAllUsers // new
} = require('./index');

async function testDB() {
  try {
    // client.connect();
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

// inside db/seed.js

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database 
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL
    );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error('Error building tables!');
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
  } catch (error) {
    throw error;
    // console.error(error);
  } finally {
    client.end();
  }
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());

testDB();
