const express = require("express");
const userRouter = express.Router();
const {
  createUserAndGenerateToken,
  authenticate,
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

userRouter.post("/register", async (req, res, next) => {
  try {
    res.send(await createUserAndGenerateToken(req.body));
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
