const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query(`

SELECT
  g.game_id,
  g.title,
  d.name AS developer,

  ARRAY_AGG(DISTINCT ge.name) AS genres,
  ARRAY_AGG(DISTINCT p.name) AS platforms

FROM games g

LEFT JOIN developers d
  ON g.developer_id = d.developer_id

LEFT JOIN game_genre gg
  ON g.game_id = gg.game_id

LEFT JOIN genres ge
  ON gg.genre_id = ge.genre_id

LEFT JOIN game_platform gp
  ON g.game_id = gp.game_id

LEFT JOIN platforms p
  ON gp.platform_id = p.platform_id

GROUP BY
  g.game_id,
  g.title,
  d.name

ORDER BY g.title ASC;

  `);
  return rows;
}

async function createGame(game) {
  const result = await pool.query("INSERT INTO games (title, developer_id) VALUES ($1, $2) RETURNING game_id;", [game.title, game.developerId]);
  const gameId = result.rows[0].game_id;
  for (const genreId of game.genreIds) {
    await pool.query("INSERT INTO game_genre (game_id, genre_id) VALUES ($1, $2);", [gameId, genreId]);
  };
  for (const platformId of game.platformIds) {
    await pool.query("INSERT INTO game_platform (game_id, platform_id) VALUES ($1, $2);", [gameId, platformId]);
  };
}

async function readGame(id) {
    const { rows } = await pool.query(`

SELECT
  g.game_id,
  g.title,
  d.name AS developer,

  ARRAY_AGG(DISTINCT ge.name) AS genres,
  ARRAY_AGG(DISTINCT p.name) AS platforms

FROM games g

LEFT JOIN developers d
  ON g.developer_id = d.developer_id

LEFT JOIN game_genre gg
  ON g.game_id = gg.game_id

LEFT JOIN genres ge
  ON gg.genre_id = ge.genre_id

LEFT JOIN game_platform gp
  ON g.game_id = gp.game_id

LEFT JOIN platforms p
  ON gp.platform_id = p.platform_id

WHERE game_id = $1;
`, [id]);
  return rows[0];
}

async function updateGame(game) {
  await pool.query("UPDATE games SET title = $1 WHERE game_id = $2;", [
    game.title,
    game.id,
  ]);
  await pool.query("DELETE FROM game_genre WHERE game_id = $1;", [game.id]);
  await pool.query("DELETE FROM game_platform WHERE game_id = $1;", [game.id]);
  for (const genreId of game.genreIds) {
    await pool.query("INSERT INTO game_genre (game_id, genre_id) VALUES ($1, $2);", [game.id, genreId]);
  };
  for (const platformId of game.platformIds) {
    await pool.query("INSERT INTO game_platform (game_id, platform_id) VALUES ($1, $2);", [game.id, platformId]);
  };
}

async function deleteGame(id) {
  await pool.query("DELETE FROM games WHERE game_id = $1;", [id]);
}

module.exports = {
  getAllGames,
  createGame,
  readGame,
  updateGame,
  deleteGame,
};
