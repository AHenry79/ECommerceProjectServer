const express = require("express");
const router = express.Router();
const {
  getCartItemsByUserId,
  addToCartByUserId,
  deleteCartItemById,
} = require("../db/index");

router.get("/:id", async (req, res, next) => {
  try {
    res.send(await getCartItemsByUserId(req.params.id));
  } catch (err) {
    next(err);
  }
});
module.exports = router;