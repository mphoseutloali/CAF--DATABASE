// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // MongoDB-based user routes

// Initialize dotenv to use environment variables
dotenv.config();

// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'wings',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Connect to MongoDB for user management
mongoose
  .connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use MongoDB-based routes for user management
app.use('/api/users', userRoutes);

// MySQL-based route to get all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// Route to add a new product to MySQL
app.post('/api/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
  const values = [name, description, category, price, quantity];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database insert error' });
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Route to delete a product by id in MySQL
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database delete error' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});


// Route to delete a user by password in MySQL
app.delete('/api/users', (req, res) => {
  const { password } = req.body; // Get the password from the request body
  const query = 'DELETE FROM users WHERE password = ?'; // SQL query to delete user by password

  // Execute the delete query
  db.query(query, [password], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    if (result.affectedRows === 0) {
      // If no user was found with the given password
      return res.status(404).json({ message: 'User not found with that password' });
    }

    // Send success response
    res.json({ message: 'User deleted successfully' });
  });
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
