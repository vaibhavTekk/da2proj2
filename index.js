const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'host1',
  password: 'host1',
  database: 'grocery_store',
  port: 1433
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing

app.get('/items', (req, res) => {
  connection.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
    console.log("data fetched");
  });
});

app.post('/add-item', (req, res) => {
    const { itemName, itemPrice, itemImage } = req.body;
  
    connection.query('INSERT INTO items (itemName, itemPrice, itemImage) VALUES (?, ?, ?)', [itemName, itemPrice, itemImage], (err) => {
      if (err) {
        console.error('Error inserting new item: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      res.sendStatus(200);
      console.log("inserted item");
    });
  });

app.post('/add-to-cart', (req, res) => {
  const {itemId, itemName, itemPrice } = req.body;
  connection.query('SELECT * FROM cart_items WHERE itemId = ?', [itemId], (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      const quantity = results[0].quantity + 1;
      connection.query('UPDATE cart_items SET quantity = ? WHERE itemId = ?', [quantity, itemId], (err) => {
        if (err) {
          console.error('Error updating the quantity: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.sendStatus(200);
        console.log("Updated qty");
      });
    } else {
      connection.query('INSERT INTO cart_items (itemName, itemPrice, quantity, itemId) VALUES (?, ?, 1, ?)', [itemName, itemPrice,itemId], (err) => {
        if (err) {
          console.error('Error inserting new item: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.sendStatus(200);
        console.log("Inserted new item");
      });
    }
  });
});

app.post('/checkout', (req, res) => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const items = req.body.items;
  
    // Generate bill logic here
    let total = 0;
    let billItems = '';
  
    items.forEach(item => {
      const itemTotal = item.itemPrice * item.quantity;
      total += itemTotal;
      billItems += `${item.itemName} - $${item.itemPrice} x ${item.quantity} = $${itemTotal}\n`;
    });
  
    // Add the bill record to the orders table
    connection.query('INSERT INTO orders (billItems, total, date) VALUES (?, ?, ?)', [billItems, total, date], (err) => {
      if (err) {
        console.error('Error inserting new order: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      // Clear the cart_items table
      connection.query('DELETE FROM cart_items', (err) => {
        if (err) {
          console.error('Error clearing cart items: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        res.sendStatus(200);
        console.log("cleared and created order");
      });
    });
  });

app.get('/cart-items', (req, res) => {
  connection.query('SELECT * FROM cart_items', (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

app.get('/orders', (req, res) => {
    connection.query('SELECT * FROM orders', (err, results) => {
      if (err) {
        console.error('Error querying the database: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
});
    

app.listen(8000, () => {
  console.log('Server is running on port 3000');
});
