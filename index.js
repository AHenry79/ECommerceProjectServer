const express = require("express");
const app = express();
const { client } = require("./db/index");

app.use(express.json());
client.connect();

app.use("/api/users", require("./api/users"));
app.use("/api/products", require("./api/products"));
app.use("/api/", require("./api/cart.js"));

app.listen(6800, () => {
  console.log("App is running at port 6800");
});
