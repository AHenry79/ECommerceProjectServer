const { client, getAllUsers } = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS orders;
      `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "price" numeric NOT NULL,
        "desciption" text NOT NULL,
        "name" text NOT NULL,
        "categories" text NOT NULL,
        "image_url" varchar NOT NULL,
        "availability" bool NOT NULL DEFAULT true,
        PRIMARY KEY ("id")
        );

       CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        "email" text NOT NULL,
        "phoneNumber" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
        );

        CREATE TABLE "cart" (
        "id" SERIAL NOT NULL,
        "product_id" int4 NOT NULL,
        "customer_id" int4 NOT NULL,
        PRIMARY KEY ("id")
        );

         CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "product_id" int4 NOT NULL,
        "customer_id" int4 NOT NULL,
        "ordered_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
        );
      `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await client.query(`
        CREATE UNIQUE INDEX users_username_idx ON users USING btree (username);

        INSERT INTO "users" ("id", "username", "password", "email", "phoneNumber", "created_at", "updated_at") VALUES
        (5, 'sam23', 'pass123', 'sam233@gmail.com', '718-928-2383', '2024-06-13 14:28:44.156062-04', '2024-06-13 14:28:44.156062-04'),
        (6, 'peter2434', 'pass333', 'pete5@gmail.com', '888-923-3283', '2024-06-13 14:28:44.156062-04', '2024-06-13 14:28:44.156062-04'),
        (7, 'matt343', 'mattp09@gmail.com', 'mparker56@gmail.com', '029-238-2382', '2024-06-13 14:28:44.156062-04', '2024-06-13 14:28:44.156062-04');
        `);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}
async function createInitialProducts() {
  await client.query(`
           CREATE UNIQUE INDEX product_pkey ON products USING btree (id);

            INSERT INTO "products" ("id", "price", "desciption", "name", "categories", "image_url", "availability") VALUES
            (4, 5.99, 'fruit', 'blueberries', 'produce', 'https://i5.walmartimages.com/asr/206db476-ca7d-4919-a4a5-c25dd2ae5feb_1.f7927999cdacc320a6c5a83462cadbd5.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF', 't'),
            (14, 1.99, 'fruit', 'bannas', 'produce', 'https://www.walmart.com/ip/Marketside-Fresh-Organic-Bananas-Bunch/51259338?athbdg=L1200', 't'),
            (16, 5.44, 'fruit', 'peaches', 'produce', 'https://www.walmart.com/ip/Fresh-Organic-Peaches-2-lb-Bag/157005099', 't'),
            (19, 4.92, 'fruit', 'lemon', 'produce', 'https://www.walmart.com/ip/Fresh-Organic-Lemons-2-lb-Bag/51259193', 't'),
            (20, 3.47, 'fruit', 'strawberries', 'produce', 'https://www.walmart.com/ip/Fresh-USDA-Organic-Strawberries-1-lb-Container/45618183', 't'),
            (21, 3.66, 'fruit', 'Pink Lady Apples', 'produce', 'https://www.walmart.com/ip/Fresh-Organic-Pink-Lady-Apples-2-lb-Pouch/51259207', 't'),
            (22, 8.12, 'fruit', 'fuji apples', 'produce', 'https://www.walmart.com/ip/Fresh-Organic-Fuji-Apples-3-lb-Bag/165846014', 't'),
            (24, 1.66, 'vegetable', 'Baby Carrots', 'produce', 'https://www.walmart.com/ip/Organic-Marketside-Fresh-Baby-Peeled-Carrots-1-lb-Bag/51259199', 't'),
            (25, 1.99, 'vegetable', 'Onions', 'produce', 'https://www.walmart.com/ip/Fresh-Yellow-Onions-3-lb-Bag/10447842', 't'),
            (26, 0.88, 'vegetable', 'cilantro', 'produce', 'https://www.walmart.com/ip/Fresh-Cilantro-Bunch/160597260', 't'),
            (27, 2.99, 'vegetable', 'broccoli', 'produce', ' https://www.walmart.com/ip/Savor-Brands-Grade-A-Broccoli-Cuts-20-Pound-1-each/374312923?from=/search', 't'),
            (28, 3.99, 'vegetable', 'green beans', 'produce', ' https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.eatingwell.com%2Fthmb%2FzOSGCalh6otXC12446RNP8_TeBM%3D%2F1500x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2Fquick-easy-green-beans-step-2-9d1ca0c6d9f94332be6f371e257106da.jpg&tbnid=fjLw8FBJfjShvM&vet=12ahUKEwilg82RjtmGAxVQD2IAHYM4CwkQMygBegUIARCyAQ..i&imgrefurl=https%3A%2F%2Fwww.eatingwell.com%2Frecipe%2F362784%2Fquick-easy-green-beans%2F&docid=XQby3dbpEQBpMM&w=1500&h=1500&q=green%20beans&ved=2ahUKEwilg82RjtmGAxVQD2IAHYM4CwkQMygBegUIARCyAQ', 't'),
            (29, 2.99, 'vegetable', 'cauliflower', 'produce', 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F2%2F2f%2FChou-fleur_02.jpg&tbnid=jTLnX-4gjJsJ1M&vet=12ahUKEwi0xuqkjtmGAxVFOlkFHUHDBBAQMygDegQIARBt..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCauliflower&docid=it6iEba4DxmQbM&w=4320&h=3456&q=cauliflower&ved=2ahUKEwi0xuqkjtmGAxVFOlkFHUHDBBAQMygDegQIARBt', 't'),
            (30, 5.99, 'fruit', 'kiwi', 'produce', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Kiwi-fruits-582a07b.jpg?quality=90&resize=556,505', 't'),
            (31, 7.99, 'fruit', 'cherries', 'produce', 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fblog.lexmed.com%2Fimages%2Flibrariesprovider80%2Fblog-post-featured-images%2Fshutterstock_1933299218.jpg%3Fsfvrsn%3D4a8d900b_0&tbnid=XRwrOMUTKqeYkM&vet=12ahUKEwi3xrD8jtmGAxXiBmIAHYfaCCUQMygEegUIARCyAQ..i&imgrefurl=https%3A%2F%2Fblog.lexmed.com%2Fhome%2Fblog%2F2022%2F11%2F01%2Fsuperfood-of-the-month-cherries&docid=KZWe2fE4iYnO_M&w=1900&h=1267&q=cherries&ved=2ahUKEwi3xrD8jtmGAxXiBmIAHYfaCCUQMygEegUIARCyAQ', 't'),
            (32, 10.99, 'fruit', 'watermelon', 'produce', 'https://cdn.britannica.com/99/143599-050-C3289491/Watermelon.jpg', 't'),
            (34, 5.99, 'fruit', 'grape', 'produce', 'https://www.fourwindsgrowers.com/cdn/shop/products/blackmonukka_1024x1024.jpg?v=1538780984', 't')
`);
}
async function createInitialCartItems() {
  try {
    console.log("Starting to create cart items...");
    await client.query(`
        INSERT INTO "cart" ("id", "product_id", "customer_id") VALUES
        (2, 27, 7),
        (3, 28, 5),
        (8, 14, 7)
        `);
    console.log("Finished creating cart items!");
  } catch (error) {
    console.log("Error creating cart items!");
    throw error;
  }
}
async function createInitialOrderedItems() {
  try {
    console.log("Starting to create ordered items...");
    await client.query(`
        INSERT INTO "orders" ("product_id", "customer_id") VALUES
        (14, 7)
        `);
    console.log("Finished creating ordered items!");
  } catch (error) {
    console.log("Error creating ordered items!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialCartItems();
    await createInitialProducts();
    await createInitialOrderedItems();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
