const express = require("express");
const router = express.Router();
const {
  getCartItemsByUserId,
  addToCartByUserId,
  deleteCartItemById,
  findUserWithToken,
} = require("../db/index");

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (err) {
    next(err);
  }
};

router.get("/users/:id", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await getCartItemsByUserId(req.params.id));
  } catch (err) {
    next(err);
  }
});
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    req.body.customer_id = req.user.id;
    res.send(await addToCartByUserId(req.body));
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const customer_id = req.user.id;
    res.send(await deleteCartItemById(req.params.id, customer_id));
  } catch (err) {
    next(err);
  }
});
module.exports = router;
