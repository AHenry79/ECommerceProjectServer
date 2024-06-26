const { client, getAllUsers } = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS orders;
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
        "description" text NOT NULL,
        "name" text NOT NULL,
        "categories" text NOT NULL,
        "image_url" varchar NOT NULL,
        "availability" bool NOT NULL DEFAULT true,
        "nutrition_facts" varchar NOT NULL,
        PRIMARY KEY ("id")
        );

       CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        "email" text NOT NULL,
        "phone_number" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "is_admin" bool NOT NULL DEFAULT false,
        PRIMARY KEY ("id")
        );

        CREATE TABLE "cart" (
        "id" SERIAL NOT NULL,
        "product_id" int4 NOT NULL,
        "customer_id" int4 NOT NULL,
        "quantity" int4 NOT NULL DEFAULT 1,
        PRIMARY KEY ("id")
        );

         CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "product_id" int4 NOT NULL,
        "customer_id" int4 NOT NULL,
        "ordered_at" timestamptz NOT NULL DEFAULT now(),
        "quantity" int4 NOT NULL DEFAULT 1,
        "price" numeric NOT NULL,
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
        CREATE UNIQUE INDEX users_email_idx ON users USING btree (email);

        INSERT INTO "users" ("username", "password", "email", "phone_number", "is_admin") VALUES
        ('sam23', '$2a$12$FDlGHy/b5B9FR4E77QKl8.dJVBBWr8dbjlvtoY/2wfpG9Av.aYjtu', 'sam233@gmail.com', '718-928-2383', 'f'),
        ('peter2434', '$2a$12$Xmf2olmUzUAFIydADFzK6emXE9fdhxpN4K3IC9EDQUtJpEMPVWtUW', 'pete5@gmail.com', '888-923-3283', 'f'),
        ('matt343', '$2a$12$y2na6B3jaW9p1TeZ9M2O7eY3eBLQcWrt7ABWMx334enQdqKA12eNe', 'mparker56@gmail.com', '029-238-2382', 'f'),
        ('admin', '$2a$12$DDAlVqFpMuuqN9xOPGUgG.bAfA6.uzb2ekx9IqiMmp/6EjC.1R7eW', 'admin@gmail.com', '555-555-5555', 't');
        `);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}
async function createInitialProducts() {
  await client.query(`
            INSERT INTO "products" ("price", "description", "name", "categories", "image_url", "availability", "nutrition_facts") VALUES
            (1.99, 'fruit', 'Bananas', 'produce', 'https://media.npr.org/assets/img/2011/08/19/istock_000017061174small_wide-a68a0b8f0b250cba6f5964ce5807de10d93dd4b9.jpg?s=1400&c=100&f=jpeg', 't', 'https://www.melissas.com/cdn/shop/products/image-of-organic-bananas-organics-27999845154860_327x568.jpg?v=1626729677'),
            (5.44, 'fruit', 'Peaches', 'produce', 'https://media.istockphoto.com/id/1137630158/photo/single-peach-fruit-with-leaf-isolated-on-white.jpg?s=612x612&w=0&k=20&c=V8OmiANLcA-hGHcyK6QkXRhXvpnUiAcXo6uKnbwTtQ8=', 't', 'https://i5.walmartimages.com/asr/4dd60ba0-c943-4303-b030-7097db55bb7f_1.699886a461cf736f63264fd0ef5438e3.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF'),
            (4.92, 'fruit', 'Lemon', 'produce', 'https://media.istockphoto.com/id/1389128157/photo/lemon-fruit-with-leaf-isolated-whole-lemon-and-a-half-with-leaves-on-white-background-lemons.jpg?s=612x612&w=0&k=20&c=Gjyv0Yd0gMG4JZ5iE9e864ilZrurflx1gU6cKHn4E2s=', 't', 'https://www.melissas.com/cdn/shop/products/image-of-organic-meyer-lemons-fruit-28657802313772_326x545.jpg?v=1628088878'),
            (3.47, 'fruit', 'Strawberries', 'produce', 'https://i5.walmartimages.com/asr/373f0c0a-d976-4518-967c-9e8c626d1a10.fd992b4534c99ffa7bba91525be393cb.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF', 't', 'https://www.naturipefarms.com/wp-content/themes/naturipe/assets/img/strawberries/strawberries-nutrition-facts-2020.svg'),
            (3.66, 'fruit', 'Pink Lady Apples', 'produce', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIkKX2p0tqYO1BTqttWvcvugD5yNcPnG6fnQ&usqp=CAU', 't', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrXaDI66a4btBqy6wFPLheAxQoGj7I88sGWw&s'),
            (8.12, 'fruit', 'Fuji Apples', 'produce', 'https://doorstepproduce.com/cdn/shop/products/6000200094512.jpg?v=1601387354', 't', 'https://www.melissas.com/cdn/shop/products/5-pounds-image-of-organic-fuji-apples-fruit-28658480840748_326x568.jpg?v=1628019593'),
            (1.66, 'vegetable', 'Baby Carrots', 'produce', 'https://static.vecteezy.com/system/resources/previews/003/040/897/large_2x/baby-carrots-on-white-background-free-photo.jpg', 't', 'https://www.melissas.com/cdn/shop/products/image-of-sweet-baby-carrots-vegetables-28143527002156_395x700.jpg?v=1619575781'),
            (1.99, 'vegetable', 'Onions', 'produce', 'https://toriavey.com/images/2013/05/All-About-Onions-on-TheShiksa.com-history-cooking-tutorial.jpg', 't', 'https://www.melissas.com/cdn/shop/products/image-of-organic-red-onions-28037182750764_321x540.jpg?v=1628016709'),
            (0.88, 'vegetable', 'Cilantro', 'produce', 'https://t3.ftcdn.net/jpg/01/01/26/10/360_F_101261047_sU0WdKqW7ugC92ou2M2ZWcJTTpwLJJe2.jpg', 't', 'https://www.melissas.com/cdn/shop/products/image-of-cilantro-other-28221584343084_321x544.jpg?v=1622561258'),
            (2.99, 'vegetable', 'Broccoli', 'produce', 'https://cdn.britannica.com/25/78225-050-1781F6B7/broccoli-florets.jpg', 't', 'https://healthyholic.com/cdn/shop/files/Broccoli_-_Nutrition_Label.jpg?v=1644962426'),
            (3.99, 'vegetable', 'Green Beans', 'produce', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6spTGXw-IwqJvJ33mo4c4eO3W41HbSKkPzk-R9wPjimCCEY_BnRyWbZViLUO26NbiqkQ&usqp=CAU', 't', 'https://i5.walmartimages.com/asr/b11f06b2-d532-4c64-9196-d24630d6ec4d.d633397ee2453b333fd901126875107b.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF'),
            (2.99, 'vegetable', 'Cauliflower', 'produce', 'https://img.freepik.com/premium-photo/white-cauliflower-white-isolated-background_565470-663.jpg', 'f', 'https://i5.walmartimages.com/asr/c5dbd285-2fee-499d-a565-2fcd2aaef196.c2b8f537b4a268a4eeddc7241bdb2b2e.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF'),
            (5.99, 'fruit', 'Kiwi', 'produce', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Kiwi-fruits-582a07b.jpg?quality=90&resize=556,505', 't', 'https://fruitsfromchile.com/wp-content/uploads/2019/04/Kiwifruit-nutrition-fact.png'),
            (7.99, 'fruit', 'Cherries', 'produce', 'https://t4.ftcdn.net/jpg/08/00/85/75/360_F_800857572_Getr5G7eSd41d1tpzawixAs43sSnevSH.jpg', 't', 'https://www.stemilt.com/wp-content/uploads/2021/12/Cherry-Nutrition-Facts-2021.png'),
            (10.99, 'fruit', 'Watermelon', 'produce', 'https://cdn.britannica.com/99/143599-050-C3289491/Watermelon.jpg', 't', 'https://foodgardening.mequoda.com/wp-content/uploads/2020/11/Watermelon-nutrition-265x353.png'),
            (5.99, 'fruit', 'Grape', 'produce', 'https://www.fourwindsgrowers.com/cdn/shop/products/blackmonukka_1024x1024.jpg?v=1538780984', 't', 'https://www.melissas.com/cdn/shop/products/image-of-moon-drop-grapes-fruit-27989640314924_326x595.jpg?v=1626276709')
`);
}
async function createInitialCartItems() {
  try {
    console.log("Starting to create cart items...");
    await client.query(`
        INSERT INTO "cart" ("product_id", "customer_id", "quantity") VALUES
        (3, 3, 2),
        (10, 1, 1),
        (14, 3, 1)
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
        INSERT INTO "orders" ("product_id", "customer_id", "quantity", "price") VALUES
        (14, 3, 1, 7.99),
        (5, 2, 2, 7.32),
        (1, 3, 5, 9.95)
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
