const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname));

app.get("/", function (req, res) {
  console.log("We are here...");
  res.sendFile("index.html");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
