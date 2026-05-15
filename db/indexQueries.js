const pool = require("./pool");

async function getInventory() {
  const { rows } = await pool.query(`
SELECT
(SELECT COUNT(*) FROM games) AS game_count,
(SELECT COUNT(*) FROM developers) AS developer_count,
(SELECT COUNT(*) FROM genres) AS genre_count,
(SELECT COUNT(*) FROM platforms) AS platform_count;
  `);
  return rows[0];
}

module.exports = {
    getInventory,
}