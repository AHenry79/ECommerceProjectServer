const express = require("express");
const ordersRouter = express.Router();
const {
  getAllOrders,
  getSingleOrder,
  getProductsByOrderId,
  checkOut,
} = require("../db/index");

ordersRouter.get("/", async (req, res, next) => {
  try {
    res.send(await getAllOrders());
  } catch (err) {
    next(err);
  }
});
ordersRouter.get("/:id", async (req, res, next) => {
  try {
    res.send(await getSingleOrder(req.params.id));
  } catch (err) {
    next(err);
  }
});
ordersRouter.get("/users/:id", async (req, res, next) => {
  try {
    res.send(await getProductsByOrderId(req.params.id));
  } catch (err) {
    next(err);
  }
});
ordersRouter.post("/", async (req, res, next) => {
  try {
    res.send(await checkOut(req.body));
  } catch (err) {
    next(err);
  }
});
module.exports = ordersRouter;
