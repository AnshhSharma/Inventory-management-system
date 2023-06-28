const express = require('express');
const collection = require('./mongo');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { userCollection, orderCollection } = require('./mongo');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

    const existingOrder = await orderCollection.findOne({ id: id });

    if (existingOrder) {
      // If order with the same id already exists, send a 400 error response
      res.status(400).json({ error: 'Order with the same id already exists' });
    } else {
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
    const order = await orderCollection.findOne({ id: id });

    if (order) {
      const updatedOrder = {
        id: order.id,
        type: order.type,
        quantity: order.quantity,
        state: 'completed'
      }
      await orderCollection.deleteOne({ id: id });
      await orderCollection.insertMany([updatedOrder]);
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (e) {
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
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (e) {
    res.json('There is some error');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

