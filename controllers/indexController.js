const index = (req, res) => {
  res.render("index", { title: "Express Template" });
}

module.exports = {
    index,
}