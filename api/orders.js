const express = require("express");
const ordersRouter = express.Router();
const {
  getAllOrders,
  getSingleOrder,
  getProductsByOrderId,
  checkOut,
  findUserWithToken,
} = require("../db/index");

const isAdmin = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    if (req.user.is_admin === true) {
      next();
    }
  } catch (err) {
    next(err);
  }
};
const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (err) {
    next(err);
  }
};

ordersRouter.get("/", isAdmin, async (req, res, next) => {
  try {
    res.send(await getAllOrders());
  } catch (err) {
    next(err);
  }
});
ordersRouter.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const customer_id = req.user.id;
    res.send(await getSingleOrder(req.params.id, customer_id));
  } catch (err) {
    next(err);
  }
});
ordersRouter.get("/users/:id", isLoggedIn, async (req, res, next) => {
  try {
    const customer_id = req.user.id;
    res.send(await getProductsByOrderId(req.params.id, customer_id));
  } catch (err) {
    next(err);
  }
});
ordersRouter.post("/", isLoggedIn, async (req, res, next) => {
  try {
    req.body.customer_id = req.user.id;
    res.send(await checkOut(req.body));
  } catch (err) {
    next(err);
  }
});
module.exports = ordersRouter;
