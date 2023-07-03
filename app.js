const express = require('express');
const collection = require('./mongo');
const cors = require('cors');
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
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


// Modify an order
app.post('/modifyOrder', async (req, res) => {
  const { id, type, quantity } = req.body;

  // Input validation
  if (!id || !type || !quantity) {
    return res.status(400).json({ error: 'All fields are mandatory to fill' });
  }

  try {

    const data = await orderCollection.findOne({ id: id })
    if (data) {
      let response;

      if (data.state === 'pending') {
        response = await orderCollection.updateOne(
          { id: id },
          { $set: { type, quantity } }
        );
      }
      else {
        const availableStock = await stockSummaryCollection.findOne({ type: type });

        if (data.type === type) {
          if (availableStock && (availableStock.quantity + data.quantity) >= quantity) {
            response = await orderCollection.updateOne(
              { id: id },
              { $set: { type, quantity } }
            );
            await stockSummaryCollection.updateOne(
              { type: type },
              { quantity: (availableStock.quantity + data.quantity - quantity) }
            )
            await stockCollection.updateOne({ id: id }, { type: type, quantity: (-1 * quantity), price: (-1 * getPriceByType(type) * quantity) });
          }
          else {
            return res.status(404).json({ error: 'You can not increase quantity more than the available stock' });
          }
        }
        else {
          if (availableStock && availableStock.quantity >= quantity) {
            // modifying Order Value
            response = await orderCollection.updateOne(
              { id: id },
              { $set: { type, quantity } }
            );

            // Modify the Available stock quantity
            await stockSummaryCollection.updateOne(
              { type: type },
              { quantity: (availableStock.quantity - parseInt(quantity)) }
            );
            const oldStock = await stockSummaryCollection.findOne({ type: data.type });
            await stockSummaryCollection.updateOne(
              { type: data.type },
              { quantity: (oldStock.quantity + data.quantity) }
            )
            await stockCollection.updateOne({ id: id }, { type: type, quantity: (-1 * quantity), price: (-1 * getPriceByType(type) * parseInt(quantity)) });

          }
          else {
            return res.status(404).json({ error: 'You can not increase quantity more than the available stock' });
          }
        }
      }

      if (response.modifiedCount === 1) {
        return res.json({ status: 'Order modified successfully' });
      }
    }
    else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.log('Error modifying order:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
      const availableStock = await stockSummaryCollection.findOne({ type: order.type });
      // if enough stock is available
      if (availableStock && order.quantity <= availableStock.quantity) {
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
          quantity: -1 * stockLog.quantity,
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
      // console.log('Summary inserted into the database');
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

// fetch Stock summary data
app.get('/stockSummary', async (req, res) => {
  try {
    const stockSummary = await stockSummaryCollection.find();
    res.json(stockSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// downloading pending orders data in pdf form;
app.get('/:document/download-pdf', async (req, res) => {
  const document = req.params.document;
  try {
    let data;

    if (document == 'pending-orders') {
      data = await orderCollection.find({ state: 'pending' });
    }
    else if (document == 'completed-orders') {
      data = await orderCollection.find({ state: 'completed' });
    }
    else if (document == 'stock-log') {
      data = await stockCollection.find();
    }
    else if (document == 'stock') {
      data = await stockSummaryCollection.find();
    }
    if (!data || data.length === 0) {
      // Handle case when no data is found
      return res.status(404).send('No data found');
    }

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.text(`${document.toUpperCase()} REPORT`, { align: 'center', fontSize: 18, underline: true, marginBottom: 10 });
    let docHeaders;
    let columnWidths = [50, 100, 80, 80];
    if (document == 'pending-orders' || document == 'completed-orders') {
      docHeaders = ['ID', 'Type', 'Quantity', 'State'];
    }
    else if (document == 'stock-log') {
      docHeaders = ['ID', 'Type', 'Quantity', 'Price'];
    }
    else if (document == 'stock') {
      docHeaders = ['Type', 'Quantity', 'Price Per Unit'];
      columnWidths = [100, 80, 80];
    }
    const table = {
      headers: docHeaders,
      rows: [],
    };

    // Populate the table rows with data
    data.forEach((order) => {
      if (document == 'pending-orders' || document == 'completed-orders') {
        table.rows.push([order.id.toString(), order.type, order.quantity.toString(), order.state]);
      }
      else if (document == 'stock-log') {
        table.rows.push([order.id.toString(), order.type, order.quantity.toString(), order.price.toString()]);
      }
      else if (document == 'stock') {
        table.rows.push([order.type, order.quantity.toString(), order.pricePerUnit.toString()]);
      }
    });

    // Set the initial y-coordinate for the table
    let y = doc.y + 40;
    let X = doc.x + 60;
    // Draw the table headers
    table.headers.forEach((header, i) => {
      doc.text(header, X + columnWidths.slice(0, i).reduce((sum, width) => sum + width, 0), y, { width: columnWidths[i], align: 'left', fontFamily: 'Helvetica-Bold' });
    });

    y += 40;

    // Draw the table rows
    table.rows.forEach((row) => {
      let x = X // Reset the x-coordinate for each row
      row.forEach((cell, i) => {
        doc.text(cell, x, y, { width: columnWidths[i], align: 'left' });
        x += columnWidths[i]; // Update the x-coordinate for the next cell
      });
      y += 20;
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Downloading collection data in Excel format
app.get('/:collectionName/download-excel', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    let data;

    if (collectionName === 'pending-orders') {
      data = await orderCollection.find({ state: 'pending' });
    } else if (collectionName === 'completed-orders') {
      data = await orderCollection.find({ state: 'completed' });
    } else if (collectionName === 'stock-log') {
      data = await stockCollection.find();
    } else if (collectionName === 'stock') {
      data = await stockSummaryCollection.find();
    }

    if (!data || data.length === 0) {
      // Handle case when no data is found
      return res.status(404).send('No data found');
    }

    // Map the data to the desired format
    let mappedData;
    if (collectionName == 'pending-orders' || collectionName == 'completed-orders') {
      mappedData = data.map(item => ({
        ID: item.id,
        Product_TYPE: item.type,
        Quantity: item.quantity,
        State: item.state
      }));
    }
    else if (collectionName == 'stock-log') {
      mappedData = data.map(item => ({
        ID: item.id,
        Product_TYPE: item.type,
        Quantity: item.quantity,
        Price: item.price
      }));
    }
    else if (collectionName == 'stock') {
      mappedData = data.map(item => ({
        Product_TYPE: item.type,
        Quantity: item.quantity,
        Price_Per_Unit: item.pricePerUnit
      }));
    }

    // Create a new workbook and set up the worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(mappedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a buffer from the workbook
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set the response headers
    res.setHeader('Content-Disposition', `attachment; filename=${collectionName}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the Excel file as a response
    res.send(excelBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.listen(5000, () => {
  console.log('Server running on port 5000');
});

