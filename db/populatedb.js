#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
INSERT INTO developers (name)
VALUES
  ('Nintendo'),
  ('Capcom'),
  ('Konami'),
  ('Square Enix'),
  ('FromSoftware'),
  ('Sega'),
  ('Atlus'),
  ('Bandai Namco'),
  ('Game Freak'),
  ('HAL Laboratory'),

  ('Valve'),
  ('Blizzard Entertainment'),
  ('id Software'),
  ('Bethesda Game Studios'),
  ('BioWare'),
  ('Rockstar Games'),
  ('Naughty Dog'),
  ('Insomniac Games'),
  ('CD Projekt Red'),
  ('Larian Studios'),

  ('Ubisoft'),
  ('Remedy Entertainment'),
  ('Obsidian Entertainment'),
  ('Supergiant Games'),
  ('Double Fine Productions'),
  ('Rare'),
  ('Retro Studios'),
  ('PlatinumGames'),
  ('Kojima Productions'),
  ('Toby Fox');

INSERT INTO genres (name)
VALUES
  ('Action'),
  ('Adventure'),
  ('Action-Adventure'),
  ('RPG'),
  ('JRPG'),
  ('Strategy'),
  ('Real-Time Strategy'),
  ('Turn-Based Strategy'),
  ('Simulation'),
  ('Sports'),
  ('Racing'),
  ('Puzzle'),
  ('Platformer'),
  ('Shooter'),
  ('First-Person Shooter'),
  ('Third-Person Shooter'),
  ('Fighting'),
  ('Beat ''em Up'),
  ('Survival'),
  ('Survival Horror'),
  ('Stealth'),
  ('Roguelike'),
  ('Roguelite'),
  ('Sandbox'),
  ('Open World'),
  ('Metroidvania'),
  ('Visual Novel'),
  ('Rhythm'),
  ('Party'),
  ('MMORPG'),
  ('MOBA'),
  ('Card Game'),
  ('Idle'),
  ('Educational'),
  ('Horror'),
  ('Sci-Fi'),
  ('Fantasy'),
  ('Mystery');

INSERT INTO platforms (name, abbrev)
VALUES
  ('Nintendo Entertainment System', 'NES'),
  ('Super Nintendo Entertainment System', 'SNES'),
  ('Nintendo 64', 'N64'),
  ('Nintendo GameCube', 'GC'),
  ('Nintendo Wii', 'Wii'),
  ('Nintendo Wii U', 'Wii U'),
  ('Nintendo Switch', 'Switch'),

  ('Game Boy', 'GB'),
  ('Game Boy Advance', 'GBA'),
  ('Nintendo DS', 'DS'),
  ('Nintendo 3DS', '3DS'),

  ('PlayStation', 'PS1'),
  ('PlayStation 2', 'PS2'),
  ('PlayStation 3', 'PS3'),
  ('PlayStation 4', 'PS4'),
  ('PlayStation 5', 'PS5'),
  ('PlayStation Portable', 'PSP'),
  ('PlayStation Vita', 'Vita'),

  ('Xbox', 'Xbox'),
  ('Xbox 360', 'X360'),
  ('Xbox One', 'XONE'),
  ('Xbox Series X/S', 'XSX'),

  ('Personal Computer', 'PC'),
  ('macOS', 'Mac'),
  ('Linux', 'Linux'),

  ('Sega Dreamcast', 'DC'),
  ('Sega Saturn', 'Saturn'),
  ('Sega Genesis / Mega Drive', 'Genesis'),
  ('Sega Game Gear', 'GG'),

  ('Arcade Machines', 'Arcade'),
  ('Mobile Devices', 'Mobile');

INSERT INTO games (title, developer_id)
VALUES
  ('The Legend of Zelda: Breath of the Wild', 1),
  ('Dark Souls', 5),
  ('Persona 5 Royal', 7),
  ('Half-Life 2', 11),
  ('The Witcher 3: Wild Hunt', 19),
  ('Elden Ring', 5),
  ('Chrono Trigger', 4),
  ('DOOM', 13),
  ('Undertale', 30),
  ('Metal Gear Solid V: The Phantom Pain', 29);

INSERT INTO game_genre (game_id, genre_id)
VALUES
  -- BOTW
  (1, 2),   -- Adventure
  (1, 25),  -- Open World
  (1, 4),   -- RPG

  -- Dark Souls
  (2, 4),   -- RPG
  (2, 24),  -- Roguelite
  (2, 35),  -- Fantasy

  -- Persona 5 Royal
  (3, 5),   -- JRPG
  (3, 37),  -- Mystery

  -- Half-Life 2
  (4, 14),  -- Shooter
  (4, 15),  -- FPS
  (4, 36),  -- Sci-Fi

  -- Witcher 3
  (5, 4),   -- RPG
  (5, 25),  -- Open World
  (5, 35),  -- Fantasy

  -- Elden Ring
  (6, 4),   -- RPG
  (6, 25),  -- Open World
  (6, 35),  -- Fantasy

  -- Chrono Trigger
  (7, 5),   -- JRPG
  (7, 35),  -- Fantasy

  -- DOOM
  (8, 15),  -- FPS
  (8, 36),  -- Sci-Fi
  (8, 1),   -- Action

  -- Undertale
  (9, 4),   -- RPG
  (9, 27),  -- Visual Novel

  -- MGSV
  (10, 1),  -- Action
  (10, 22), -- Stealth
  (10, 25); -- Open World

INSERT INTO game_platform (game_id, platform_id)
VALUES
  -- BOTW
  (1, 6),   -- Wii U
  (1, 7),   -- Switch

  -- Dark Souls
  (2, 14),  -- PS3
  (2, 20),  -- X360
  (2, 23),  -- PC

  -- Persona 5 Royal
  (3, 16),  -- PS5
  (3, 7),   -- Switch
  (3, 23),  -- PC

  -- Half-Life 2
  (4, 23),  -- PC
  (4, 20),  -- X360

  -- Witcher 3
  (5, 15),  -- PS4
  (5, 21),  -- XONE
  (5, 23),  -- PC
  (5, 7),   -- Switch

  -- Elden Ring
  (6, 16),  -- PS5
  (6, 22),  -- XSX
  (6, 23),  -- PC

  -- Chrono Trigger
  (7, 2),   -- SNES
  (7, 23),  -- PC
  (7, 7),   -- Switch

  -- DOOM
  (8, 23),  -- PC

  -- Undertale
  (9, 23),  -- PC
  (9, 7),   -- Switch

  -- MGSV
  (10, 15), -- PS4
  (10, 21), -- XONE
  (10, 23); -- PC
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