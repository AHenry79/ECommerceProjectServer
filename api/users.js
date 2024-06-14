const express = require("express");
const router = express.Router();
const { getAllUsers, getSingleUserById, addToCartByUserId } = require("../db/index");

// get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

// get single user by id
router.get("/:id", async (req, res, next) => {
  try {
    const user = await getSingleUserById(req.params.id);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// add to cart with user id
router.post("/add-to-cart", async (req, res, next) => {
  try {
    const cartItem = await addToCartByUserId(req.body);
    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;