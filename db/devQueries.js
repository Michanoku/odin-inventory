const pool = require("./pool");

async function getAllDevs() {
  const { rows } = await pool.query(`
    SELECT
      d.developer_id,
      d.name,
      COUNT(g.game_id) AS game_count

    FROM developers d

    LEFT JOIN games g
      ON d.developer_id = g.developer_id

    GROUP BY
      d.developer_id,
      d.name

    ORDER BY d.name ASC;
  `);

  return rows;
}

async function createDev(name) {
  await pool.query("INSERT INTO developers (name) VALUES ($1);", [name]);
}

async function readDev(id) {
  const { rows } = await pool.query(
    "SELECT * FROM developers WHERE developer_id = $1;",
    [id],
  );
  return rows[0];
}

async function updateDev(developer) {
  await pool.query("UPDATE developers SET name = $1 WHERE developer_id = $2;", [
    developer.name,
    developer.id,
  ]);
}

async function deleteDev(id) {
  await pool.query("DELETE FROM developers WHERE developer_id = $1;", [id]);
}

module.exports = {
  getAllDevs,
  createDev,
  readDev,
  updateDev,
  deleteDev,
};
