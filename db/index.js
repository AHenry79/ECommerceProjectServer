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

const getCartItemsByUserId = async (params_id) => {
  const response = await client.query(
    `SELECT * FROM cart WHERE customer_id = $1`,
    [params_id]
  );
  const { id, customer_id } = response.rows.length > 0 ? response.rows[0] : {};
  const cartItems = [];

  for (let i of response.rows) {
    const product_response = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [i.product_id]
    );
    const product = product_response.rows[0];
    cartItems.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      description: product.description,
      categories: product.categories,
      image_url: product.image_url,
      availability: product.availability,
    });
  }

  const cart = cartItems.map((item) => ({
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    description: item.description,
    categories: item.categories,
    image_url: item.image_url,
    availability: item.availability,
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
const getSingleOrder = async (id) => {
  const response = await client.query(`SELECT * FROM orders WHERE id = $1`, [
    id,
  ]);
  return response.rows[0];
};
const getProductsByOrderId = async (id) => {
  const response = await client.query(
    `SELECT * FROM orders WHERE customer_id = $1`,
    [id]
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
const deleteCartItemById = async (id) => {
  await client.query(`DELETE FROM cart WHERE id = $1`, [Number(id)]);
  return {
    id: id,
  };
};
const checkOut = async (body) => {
  await client.query(
    `INSERT INTO orders(product_id, customer_id) VALUES($1, $2)`,
    [body.product_id, body.customer_id]
  );
  return {
    product_id: body.product_id,
    customer_id: body.customer_id,
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
  const response = await client.query(
    `SELECT id, username, 
            password FROM users WHERE username=$1`,
    [username]
  );
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }

  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return {
    token,
  };
};

// middlewarefunction
const findUserWithToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }

  const response = await client.query(
    `SELECT id, username 
            FROM users WHERE id=$1`,
    [id]
  );

  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }

  return response.rows[0];
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
  getProductsByOrderId,
  checkOut,
  client,
};
