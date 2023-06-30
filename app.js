const express = require('express');
const collection = require('./mongo');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { userCollection, orderCollection, stockCollection, stockSummaryCollection } = require('./mongo');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const STOCK_TYPE_PRICE = [{ type: 'OPC', price: 1500 }, { type: 'PPC', price: 2500 }, { type: 'RAPID', price: 5000 }];
const getPriceByType = (type) => {
  const foundStock = STOCK_TYPE_PRICE.find(stock => stock.type === type);
  if (foundStock) {
    return foundStock.price;
  } else {
    return null; // or any other default value if type is not found
  }
};


app.get('/', cors(), (req, res) => {
  // Handle GET request
});

// Checking credentials from the login page
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const name = user.name;
        const loginResponse = {
          name: name,
          status: true,
        };
        res.json(loginResponse);
      } else {
        res.json({
          status: false,
        });
      }
    } else {
      res.json({
        status: false,
      });
    }
  } catch (e) {
    res.json('There is some error');
  }
});

// Logout route
app.post('/logout', (req, res) => {
  res.json({ status: true })
});

// Inserting user data to the database from the signup page
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailExists = await userCollection.findOne({ email: email });

    if (emailExists) {
      res.json({ status: false });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        name: name,
        email: email,
        password: hashedPassword,
      };

      res.json({ status: true });
      await userCollection.insertMany([userData]);
    }
  } catch (e) {
    res.json('There is some error');
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await orderCollection.find();
    res.json(orders);
  } catch (e) {
    res.json('There is some error');
  }
});

// Add a new order
app.post('/addorder', async (req, res) => {
  const { id, type, quantity, state } = req.body;

  try {
    const orderData = {
      id: id,
      type: type,
      quantity: quantity,
      state: state
    };

    const existingOrder = await (orderCollection.findOne({ id: id }) && stockCollection.findOne({ id: id }));

    if (existingOrder) {
      // If order with the same id already exists, send a 400 error response
      res.status(400).json({ error: 'Order or Stock with the same id already exists' });
    }
    else {
      if (state === 'completed') {
        const logOrder = {
          id: id,
          type: type,
          quantity: quantity * -1,
          price: -1 * order.quantity * getPriceByType(order.type)
        }
        await stockCollection.insertMany([logOrder]);
      }
      await orderCollection.insertMany([orderData]);
      res.json({ status: true });
    }
  } catch (e) {
    res.json('There is some error');
  }
});


// Mark a pending order as completed
app.put('/orders/convert/:id', async (req, res) => {
  const id = req.params.id;
  try {

    // finding if order with that id exists
    const order = await orderCollection.findOne({ id: id });
    if (order) {
      // checking the available quantity for that stock in our inventory
      const availableStock = await stockSummaryCollection.find({ type: order.type });
      console.log(availableStock);
      // if enough stock is available
      if (availableStock && order.quantity <= availableStock[0].quantity) {
        const updatedOrder = {
          id: order.id,
          type: order.type,
          quantity: order.quantity,
          state: 'completed'
        }
        const logOrder = {
          id: order.id,
          type: order.type,
          quantity: order.quantity * -1,
          price: -1 * order.quantity * getPriceByType(order.type)
        }
        await orderCollection.deleteOne({ id: id });
        await orderCollection.insertMany([updatedOrder]);
        await stockCollection.insertMany([logOrder]);
        res.json({ status: true });
      } else {
        res.status(400).json({ error: 'Not enough stock in inventory' });

      }
    }
  }
  catch (e) {
    res.json('There is some error');
  }
});


// Marking order as pending
app.put('/orders/convert-to-pending/:id', async (req, res) => {
  const id = req.params.id;
  try {

    // finding if order with that id exists
    const order = await orderCollection.findOne({ id: id });
    if (order) {
      const updatedOrder = {
        id: order.id,
        type: order.type,
        quantity: order.quantity,
        state: 'pending'
      }
      await orderCollection.deleteOne({ id: id });
      await orderCollection.insertMany([updatedOrder]);
      await stockCollection.deleteOne({ id: id });
      res.json({ status: true });
    } else {
      res.status(400).json({ error: 'Some Error' });
    }
  }
  catch (e) {
    res.json('There is some error');
  }
});


// Delete an order
app.delete('/orders/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const order = await orderCollection.findOne({ id: id });

    if (order) {
      await orderCollection.deleteOne({ id: id });
      if (order.state === 'completed') {
        const stockLog = await stockCollection.findOne({ id: id });
        if (stockLog) {
          await stockCollection.deleteOne({ id: id });

        }

      }
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (e) {
    res.json('There is some error');
  }
});


// Add Stock
app.post('/addstock', async (req, res) => {
  const { id, type, quantity, price } = req.body;

  try {
    const stockData = {
      id: id,
      type: type,
      quantity: quantity,
      price: price
    };

    const existingStockId = await (stockCollection.findOne({ id: id }) && orderCollection.findOne({ id: id }));

    if (existingStockId) {
      // If Stock Log with the same id already exists, send a 400 error response
      res.status(400).json({ error: 'Stock or Order with the same id exists' });
    } else {
      await stockCollection.insertMany([stockData]);
      res.json({ status: true });
    }
  } catch (e) {
    res.json('There is some error');
  }
});

// Delete a stock log
app.delete('/stock/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const stockLog = await stockCollection.findOne({ id: id });

    if (stockLog) {
      if (stockLog.quantity < 0) {
        const updatedOrder = {
          id: stockLog.id,
          type: stockLog.type,
          quantity: -1*stockLog.quantity,
          state: 'pending'
        }
        await orderCollection.deleteOne({ id: id });
        await orderCollection.insertMany([updatedOrder]);
        await stockCollection.deleteOne({ id: id });
        res.json({ status: true });
      }
      else {
        await stockCollection.deleteOne({ id: id });
        res.json({ status: true });
      }
    } else {
      res.json({ status: false });
    }
  } catch (e) {
    res.json('There is some error');
  }
});

// Handle the POST request to insert stock summary into the database
app.post('/stock-summary', async (req, res) => {
  await stockSummaryCollection.deleteMany({});
  const summary = req.body;
  // Insert the summary into the database
  stockSummaryCollection.insertMany(summary)
    .then(() => {
      console.log('Summary inserted into the database');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error inserting summary into the database:', error);
      res.sendStatus(500);
    });
});

// Fetch stock data
app.get('/stock', async (req, res) => {
  try {
    // Query the "stocks" collection to fetch all stock data
    const stockData = await stockCollection.find();
    res.json(stockData);
  } catch (e) {
    res.json('There is some error');
  }
});





app.listen(5000, () => {
  console.log('Server running on port 5000');
});

