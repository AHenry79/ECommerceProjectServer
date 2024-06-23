const express = require("express");
const app = express();
const { client } = require("./db/index");
const cors = require("cors");

app.use(express.json());
// const whitelist = ["http://127.0.0.1:5173"];
// const corsOptions = {
//   allowedHeaders: [
//     "Authorization",
//     "Access-Control-Allow-Origin",
//     "Content-Type",
//   ],
//   origin: function (origin, callback) {
//     // Check if the origin is allowed or if it is not provided
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });
// app.use(cors(corsOptions));
app.use(cors());
client.connect();

app.use("/api/users", require("./api/users"));
app.use("/api/products", require("./api/products"));
app.use("/auth", require("./api/auth"));
app.use("/api/cart", require("./api/cart.js"));
app.use("/api/orders", require("./api/orders.js"));

app.listen(6800, () => {
  console.log("App is running at port 6800");
});
