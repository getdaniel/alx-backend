const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const client = redis.createClient();

client.on('error', (error) => {
  console.error(error);
});

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5,
  },
];

const getItemById = (id) => {
  return listProducts.find((item) => item.itemId === id);
};

const reserveStockById = async (itemId, stock) => {
  const setAsync = promisify(client.set).bind(client);
  await setAsync(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const getAsync = promisify(client.get).bind(client);
  const reservedStock = await getAsync(`item.${itemId}`);
  return Number(reservedStock);
};

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const item = getItemById(Number(itemId));
  if (!item) {
    return res.json({ status: 'Product not found' });
  }
  const reservedStock = await getCurrentReservedStockById(Number(itemId));
  const currentQuantity = item.initialAvailableQuantity - reservedStock;
  res.json({
    itemId: item.itemId,
    itemName: item.itemName,
    price: item.price,
    initialAvailableQuantity: item.initialAvailableQuantity,
    currentQuantity: currentQuantity,
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const item = getItemById(Number(itemId));
  if (!item) {
    return res.json({ status: 'Product not found' });
  }
  const reservedStock = await getCurrentReservedStockById(Number(itemId));
  const availableStock = item.initialAvailableQuantity - reservedStock;
  if (availableStock < 1) {
    return res.json({ status: 'Not enough stock available', itemId: item.itemId });
  }
  await reserveStockById(Number(itemId), reservedStock + 1);
  res.json({ status: 'Reservation confirmed', itemId: item.itemId });
});

app.listen(1245, () => {
  console.log('Server listening on port 1245');
});
