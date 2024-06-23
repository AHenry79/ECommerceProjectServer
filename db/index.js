const pg = require("pg");
const client = new pg.Client("postgres://localhost/grocery_store");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = "shhhhhhhh";

const getAllUsers = async () => {
  const response = await client.query(`SELECT * FROM users ORDER BY id ASC`);
  return response.rows;
};
const getAllProducts = async () => {
  const response = await client.query(`SELECT * FROM products ORDER BY id ASC`);
  return response.rows;
};
const getSingleProduct = async (id) => {
  const response = await client.query(`SELECT * FROM products WHERE id = $1`, [
    id,
  ]);
  return response.rows[0];
};
const addProduct = async (body) => {
  await client.query(
    `INSERT INTO products(price, description, name, categories, image_url, availability, nutrition_facts) VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [
      body.price,
      body.description,
      body.name,
      body.categories,
      body.image_url,
      body.availability,
      body.nutrition_facts,
    ]
  );
  return {
    price: body.price,
    description: body.description,
    name: body.name,
    categories: body.categories,
    image_url: body.image_url,
    availability: body.availability,
    nutrition_facts: body.nutrition_facts,
  };
};
const editProduct = async (body) => {
  const response = await client.query(
    `UPDATE products SET price = $1, description = $2, name = $3, categories = $4, image_url = $5, availability = $6, nutrition_facts = $7 WHERE id = $8 RETURNING *`,
    [
      body.price,
      body.description,
      body.name,
      body.categories,
      body.image_url,
      body.availability,
      body.nutrition_facts,
      body.id,
    ]
  );
  return response.rows[0];
};
const deleteProduct = async (id) => {
  await client.query(`DELETE FROM products WHERE id=$1`, [Number(id)]);
  return {
    id: id,
  };
};
const getCartItemsByUserId = async (params_id) => {
  const response = await client.query(
    `SELECT * FROM cart WHERE customer_id = $1`,
    [params_id]
  );
  const { id, customer_id, quantity } =
    response.rows.length > 0 ? response.rows[0] : {};
  const cartItems = [];

  for (let i of response.rows) {
    const product_response = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [i.product_id]
    );
    const product = product_response.rows[0];
    cartItems.push({
      cart_id: i.id,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      description: product.description,
      categories: product.categories,
      image_url: product.image_url,
      availability: product.availability,
      quantity: quantity,
    });
  }

  const cart = cartItems.map((item) => ({
    cart_id: item.cart_id,
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    description: item.description,
    categories: item.categories,
    image_url: item.image_url,
    availability: item.availability,
    quantity: item.quantity,
  }));

  return {
    id: id,
    customer_id: customer_id,
    cart: cart,
  };
};
const getSingleUserById = async (id) => {
  const response = await client.query(`SELECT * FROM users WHERE id = $1`, [
    id,
  ]);
  return response.rows[0];
};
const getAllOrders = async () => {
  const response = await client.query(`SELECT * FROM orders ORDER BY id ASC`);
  return response.rows;
};
const getSingleOrder = async (id, customer_id) => {
  const cart = await client.query(
    `SELECT customer_id FROM orders WHERE id = $1`,
    [Number(id)]
  );
  if (
    cart &&
    cart.rows &&
    cart.rows.length > 0 &&
    cart.rows[0].customer_id === customer_id
  ) {
    const response = await client.query(`SELECT * FROM orders WHERE id = $1`, [
      Number(id),
    ]);
    return response.rows[0];
  } else {
    throw new Error("User is not authorized to access these orders");
  }
};
const getOrderByUserId = async (customer_id) => {
  const response = await client.query(
    `SELECT * FROM orders WHERE customer_id = $1`,
    [customer_id]
  );
  return response.rows;
};
const addToCartByUserId = async (body) => {
  await client.query(
    `INSERT INTO cart(product_id, customer_id) VALUES($1, $2)`,
    [body.product_id, body.customer_id]
  );
  return {
    product_id: body.product_id,
    customer_id: body.customer_id,
  };
};
const deleteCartItemById = async (id, customer_id) => {
  const cart = await client.query(
    `SELECT customer_id FROM cart WHERE id = $1`,
    [Number(id)]
  );
  if (
    cart &&
    cart.rows &&
    cart.rows.length > 0 &&
    cart.rows[0].customer_id === customer_id
  ) {
    await client.query(`DELETE FROM cart WHERE id=$1`, [Number(id)]);
    return {
      id: id,
    };
  } else {
    throw new Error("User is not authorized to delete this cart item");
  }
};
const checkOut = async (body) => {
  await client.query(
    `INSERT INTO orders(product_id, customer_id, quantity, price) VALUES($1, $2, $3, $4)`,
    [body.product_id, body.customer_id, body.quantity, body.price]
  );
  return {
    product_id: body.product_id,
    customer_id: body.customer_id,
    quantity: body.quantity,
    price: body.price,
  };
};
const createUser = async ({ username, password, email, phone_number }) => {
  const response = await client.query(
    `INSERT INTO users(username, password, email, phone_number) 
        VALUES($1, $2, $3, $4) RETURNING *`,
    [username, await bcrypt.hash(password, 5), email, phone_number]
  );
  return response.rows[0];
};

const createUserAndGenerateToken = async ({
  username,
  password,
  email,
  phone_number,
}) => {
  const user = await createUser({ username, password, email, phone_number });
  const token = await jwt.sign({ id: user.id }, JWT);
  return {
    token,
  };
};

const authenticate = async ({ username, password }) => {
  const response = await client.query(`SELECT * FROM users WHERE username=$1`, [
    username,
  ]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }

  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  const users = response.rows[0];
  return {
    token: token,
    users: users,
  };
};

// middlewarefunction
const findUserWithToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("test error");
    error.status = 401;
    throw error;
  }

  const response = await client.query(
    `SELECT id, username, email, phone_number, created_at, updated_at, is_admin FROM users WHERE id=$1`,
    [id]
  );

  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }

  return response.rows[0];
};
const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    req.user = jwt.verify(token, JWT);
    next();
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllUsers,
  getAllProducts,
  getSingleProduct,
  getSingleUserById,
  getCartItemsByUserId,
  addToCartByUserId,
  deleteCartItemById,
  createUser,
  createUserAndGenerateToken,
  authenticate,
  findUserWithToken,
  getAllOrders,
  getSingleOrder,
  getOrderByUserId,
  checkOut,
  addProduct,
  editProduct,
  deleteProduct,
  isLoggedIn,
  client,
};
