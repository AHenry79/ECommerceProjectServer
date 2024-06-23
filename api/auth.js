const express = require("express");
const userRouter = express.Router();
const { createUser, authenticate, isLoggedIn } = require("../db/index");

userRouter.post("/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (err) {
    next(err);
  }
});
userRouter.get("/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    next(err);
  }
});
module.exports = userRouter;
