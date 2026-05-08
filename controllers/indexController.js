const index = (req, res) => {
  res.render("index", { title: "Michanoku Gamestore" });
};

module.exports = {
  index,
};
