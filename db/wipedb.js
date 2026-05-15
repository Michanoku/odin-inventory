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
    connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();