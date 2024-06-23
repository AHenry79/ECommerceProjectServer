const express = require("express");
const productsRouter = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  findUserWithToken,
  addProduct,
  editProduct,
  deleteProduct,
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

productsRouter.post("/", isAdmin, async (req, res, next) => {
  try {
    res.send(await addProduct(req.body));
  } catch (err) {
    next(err);
  }
});

productsRouter.patch("/editProducts/:id", isAdmin, async (req, res, next) => {
  try {
    res.send(await editProduct(req.body));
  } catch (err) {
    next(err);
  }
});

productsRouter.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    res.send(await deleteProduct(req.params.id));
  } catch (err) {
    next(err);
  }
});
module.exports = productsRouter;
