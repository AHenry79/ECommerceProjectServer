const pg = require("pg");

const client = new pg.Client("postgres://localhost/grocery_store");

const getAllUsers = async () => {
  const response = await client.query(`SELECT * FROM users ORDER BY id ASC`);
  return response.rows;
};
const getAllProducts = async () => {
  const response = await client.query(`SELECT * FROM product ORDER BY id ASC`);
  return response.rows;
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
module.exports = {
  getAllUsers,
  getAllProducts,
  getSingleUserById,
  getCartItemsByUserId,
  addToCartByUserId,
  deleteCartItemById,
  client,
};
