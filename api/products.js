const express = require("express");
const productsRouter = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  getProductsByCartId,
} = require("../db/index");

productsRouter.get("/", async (req, res, next) => {
  try {
    res.send(await getAllProducts());
  } catch (err) {
    next(err);
  }
});
productsRouter.get("/:id", async (req, res, next) => {
  try {
    res.send(await getSingleProduct(req.params.id));
  } catch (err) {
    next(err);
  }
});
productsRouter.get("/cart/:id", async (req, res, next) => {
  try {
    res.send(await getProductsByCartId(req.params.id));
  } catch (err) {
    next(err);
  }
});
// changes
module.exports = productsRouter;
