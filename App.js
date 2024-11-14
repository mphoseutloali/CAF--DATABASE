import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import './App.css';

function App() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [user, setUser] = useState(localStorage.getItem('user') || null); // Persist logged-in user

  // Persist products and users to localStorage on change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Register a new user via backend API
  const registerUser = async (newUser) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const savedUser = await response.json();
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers, savedUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        return updatedUsers;
      });
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Login user
  const login = (credentials) => {
    const foundUser = users.find(
      (user) => user.username === credentials.username && user.password === credentials.password
    );
    if (foundUser) {
      setUser(foundUser.username);
      localStorage.setItem('user', foundUser.username); // Store user in localStorage
    } else {
      alert('Invalid username or password');
    }
  };

  // Logout the user
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  // Add a new product
  const addProduct = (newProduct) => {
    const productWithId = { ...newProduct, id: Date.now() };
    setProducts([...products, productWithId]);
  };

  // Update an existing product
  const updateProduct = (id, updatedProduct) => {
    setProducts(
      products.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
    );
  };

  // Delete a product
  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Sell a product
  const sellProduct = (id, quantity) => {
    const product = products.find((product) => product.id === id);
    if (product) {
      if (product.quantity >= quantity) {
        const cost = product.price * quantity;
        updateProduct(id, { quantity: product.quantity - quantity });
        alert(`Sold ${quantity} of ${product.name} for M${cost}`);
      } else {
        alert(`Not enough stock available for ${product.name}. Available quantity: ${product.quantity}`);
      }
    } else {
      alert('Product not found');
    }
  };

  return (
    <Router>
      <div className="app">
        {user ? (
          <>
            <nav>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/productManagement">Product Management</Link>
              <Link to="/userManagement">User Management</Link>
              <button onClick={handleLogout}>Logout</button>
            </nav>
            <Routes>
              <Route path="/dashboard" element={<Dashboard products={products} />} />
              <Route
                path="/productManagement"
                element={
                  <ProductManagement
                    products={products}
                    addProduct={addProduct}
                    updateProduct={updateProduct}
                    deleteProduct={deleteProduct}
                    sellProduct={sellProduct}
                  />
                }
              />
              <Route
                path="/userManagement"
                element={<UserManagement users={users} registerUser={registerUser} />}
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LoginForm login={login} registerUser={registerUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
