const express = require("express");
const app = express();
const { client } = require("./db/index");

app.use(express.json());
client.connect();

app.use("/api/users", require("./api/users"));
app.use("/api/products", require("./api/products"));
app.use("/api/cart", require("./api/cart.js"));
app.use("/api/orders", require("./api/orders.js"));

app.listen(4000, () => {
  console.log("App is running at port 4000");
});
