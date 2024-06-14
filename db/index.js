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
    `SELECT * FROM cart WHERE customer_id=$1`,
    [params_id]
  );
  const { id, product_id, customer_id } = response.rows[0];
  const product_response = await client.query(
    `SELECT* FROM products WHERE id=$1`,
    [product_id]
  );
  const user_response = await client.query(`SELECT * FROM users WHERE id=$1`, [
    customer_id,
  ]);
  return {
    id,
    product_id: product_response.rows[0],
    customer_id: user_response.rows[0],
  };
};
const getSingleUserById = async (id) => {
  const response = await client.query(`SELECT * FROM users WHERE id = $1`, [
    id,
  ]);
  return response.rows[0];
};
const addToCartByUserId = async (body) => {
  await client.query(
    `INSERT INTO cart(product_id, customer_id) VALUES($1, $2)`,
    [body.product_id, body.user_id]
  );
  return {
    product_id: body.product_id,
    user_id: body.user_id,
  };
};
const deleteCartItemById = async (id) => {
  await client.query(`DELETE FROM cart WHERE id = $1`, [Number(id)]);
  return {
    id: id,
  };
};
const createUser = async ({ username, password, email, phoneNumber }) => {
  const response = await client.query(
    `INSERT INTO users(username, password, email, phoneNumber) 
        VALUES($1, $2, $3, $4) RETURNING *`,
    [username, await bcrypt.hash(password, 5), email, phoneNumber]
  );
  return response.rows[0];
};

const createUserAndGenerateToken = async ({
  username,
  password,
  email,
  phoneNumber,
}) => {
  const user = await createUser({ username, password, email, phoneNumber });
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
  client,
};
