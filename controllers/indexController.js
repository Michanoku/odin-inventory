const db = require("../db/indexQueries");

const index = async (req, res) => {
  const counts = await db.getInventory();
  res.render("index", { title: "Michanoku Gamestore", counts: counts });
};

module.exports = {
  index,
};
