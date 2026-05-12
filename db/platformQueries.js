const pool = require("./pool");

async function getAllPlatforms() {
  const { rows } = await pool.query(`
    SELECT
    g.platform_id,
    g.name,
    g.abbrev,
    COUNT(gg.game_id) AS game_count

    FROM platforms g

    LEFT JOIN game_platform gg
    ON g.platform_id = gg.platform_id

    GROUP BY
    g.platform_id,
    g.name,
    g.abbrev

    ORDER BY g.name ASC;`);
  return rows;
}

async function createPlatform(platform) {
  await pool.query("INSERT INTO platforms (name, abbrev) VALUES ($1, $2)", [platform.name, platform.abbrev]);
}

async function readPlatform(id) {
  const { rows } = await pool.query(
    "SELECT * FROM platforms WHERE platform_id = $1;",
    [id],
  );
  return rows[0];
}

async function updatePlatform(platform) {
  await pool.query("UPDATE platforms SET name = $1, abbrev = $2 WHERE platform_id = $3;", [
    platform.name,
    platform.abbrev,
    platform.id,
  ]);
}

async function deletePlatform(id) {
  await pool.query("DELETE FROM platforms WHERE platform_id = $1;", [id]);
}

module.exports = {
  getAllPlatforms,
  createPlatform,
  readPlatform,
  updatePlatform,
  deletePlatform,
};
