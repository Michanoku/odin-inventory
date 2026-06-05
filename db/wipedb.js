#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS
  game_genre,
  game_platform,
  games,
  genres,
  platforms,
  developers
CASCADE;
`;

async function main() {
  console.log("dropping tables...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
