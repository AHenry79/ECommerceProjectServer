const pg = require("pg");

const client = new pg.Client("postgres://localhost/grocery_store");

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
const getProductsByCartId = async (params_id) => {
  const response = await client.query(
    `SELECT * FROM cart WHERE customer_id= $1`,
    [params_id]
  );
  const { id, customer_id, product_id } = response.rows[0];
  return {
    id,
    customer_id,
    product_id: response.rows,
    // product: products_response.rows,
  };
};

const getCartItemsByUserId = async (params_id) => {
  const response = await client.query(
    `SELECT * FROM cart WHERE customer_id = $1`,
    [params_id]
  );
  const { id, customer_id } = response.rows[0];
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

  return {
    id: id,
    customer_id: customer_id,
    cart: cartItems,
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
module.exports = {
  getAllUsers,
  getAllProducts,
  getSingleProduct,
  getProductsByCartId,
  getSingleUserById,
  getCartItemsByUserId,
  addToCartByUserId,
  deleteCartItemById,
  getAllOrders,
  getSingleOrder,
  getProductsByOrderId,
  client,
};
