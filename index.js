const express = require("express");
const app = express();
const { client } = require("./db/index");

app.use(express.json());
client.connect();

app.use("/api/users", require("./users"));
// app.use("/api/products", require("./products"));
app.use("/api/", require("./api/cart.js"));

app.listen(8080, () => {
  console.log("App is running at port 8080");
});
