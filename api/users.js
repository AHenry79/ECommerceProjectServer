const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUserById,
  findUserWithToken,
} = require("../db/index");

const isAdmin = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    if (req.user.is_admin === true) {
      next();
    } else {
      throw Error("Not authorized");
    }
  } catch (err) {
    next(err);
  }
};

// get all users
router.get("/", isAdmin, async (req, res, next) => {
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

router.get("/check/token", async (req, res, next) => {
  try {
    const user = await findUserWithToken(req.headers.authorization);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
