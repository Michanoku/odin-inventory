const pool = require("./pool");

async function getAllGenres() {
  const { rows } = await pool.query(`
    SELECT
    g.genre_id,
    g.name,
    COUNT(gg.game_id) AS game_count

    FROM genres g

    LEFT JOIN game_genre gg
    ON g.genre_id = gg.genre_id

    GROUP BY
    g.genre_id,
    g.name

    ORDER BY g.name ASC;`);
  return rows;
}

async function createGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
}

async function readGenre(id) {
  const { rows } = await pool.query(
    "SELECT * FROM genres WHERE genre_id = $1",
    [id],
  );
  return rows[0];
}

async function updateGenre(genre) {
  await pool.query("UPDATE genres SET name = $1 WHERE genre_id = $2", [
    genre.name,
    genre.id,
  ]);
}

async function deleteGenre(id) {
  await pool.query("DELETE FROM genres WHERE genre_id = $1", [id]);
}

module.exports = {
  getAllGenres,
  createGenre,
  readGenre,
  updateGenre,
  deleteGenre,
};
