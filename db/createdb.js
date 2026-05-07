#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

- games (title, genre, platform, developer)
- genre (name)
- platform (name)
- developer (name)

const SQL = `
CREATE TABLE IF NOT EXISTS developers (
  developer_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 64 )
);

CREATE TABLE IF NOT EXISTS games (
  game_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),

  developer_id INTEGER REFERENCES developers(developer_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS platforms (
  platform_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 64 ),
  abbrev VARCHAR ( 8 )
);

CREATE TABLE IF NOT EXISTS genres (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 )
);

CREATE TABLE game_genre (
  game_id int REFERENCES games (game_id) ON UPDATE CASCADE ON DELETE CASCADE
, genre_id int REFERENCES genres (genre_id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT game_genre_pkey PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE game_platform (
  game_id int REFERENCES games (game_id) ON UPDATE CASCADE ON DELETE CASCADE
, platform_id int REFERENCES platforms (platform_id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT game_platform_pkey PRIMARY KEY (game_id, platform_id)
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
