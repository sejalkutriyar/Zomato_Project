import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // New Order Form State
  const [newOrder, setNewOrder] = useState({ orderId: '', items: '', prepTime: '' });

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginForm);
      setUser(response.data);
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.message);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Create Order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/orders`, newOrder);
      setNewOrder({ orderId: '', items: '', prepTime: '' }); // Clear inputs
      fetchOrders();
    } catch (error) {
      alert('Failed to create order: ' + error.response?.data?.message);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { nextStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status: ' + error.response?.data?.message);
    }
  };

  // Assign Order to Partner via Dropdown
  const assignOrder = async (orderId, partnerId) => {
    if (!partnerId) return; // Ignore empty selection
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/assign`, { partnerId: Number(partnerId) });
      fetchOrders();
    } catch (error) {
      alert('Failed to assign order: ' + error.response?.data?.message);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Render Status Pills (Shared)
  const renderStatus = (currentStatus) => {
    const statuses = ['PREP', 'PICKED', 'ON_ROUTE', 'DELIVERED'];
    return (
      <div className="status-pills">
        {statuses.map((status) => (
          <span
            key={status}
            className={`pill ${status === currentStatus ? 'active' : ''} ${status === currentStatus ? status.toLowerCase() : ''}`}
          >
            {status}
          </span>
        ))}
      </div>
    );
  };

  // --- PARTNER VIEW RENDERER ---
  const renderPartnerView = () => {
    // Find the order assigned to this partner
    // Note: In a real app, filtering might happen on backend, but here we filter the list
    const myOrder = orders.find(o => o.assignedPartner === user.partnerId && o.status !== 'DELIVERED');

    // Button Logic
    let actionBtn = null;
    if (myOrder) {
      if (myOrder.status === 'PREP') {
        actionBtn = <button className="big-action-btn" onClick={() => updateOrderStatus(myOrder.orderId, 'PICKED')}>MARK AS PICKED</button>;
      } else if (myOrder.status === 'PICKED') {
        actionBtn = <button className="big-action-btn" onClick={() => updateOrderStatus(myOrder.orderId, 'ON_ROUTE')}>START DELIVERY</button>;
      } else if (myOrder.status === 'ON_ROUTE') {
        actionBtn = <button className="big-action-btn" onClick={() => updateOrderStatus(myOrder.orderId, 'DELIVERED')}>MARK AS DELIVERED</button>;
      }
    }

    return (
      <div className="partner-container">
        <h2 className="view-title">Delivery Partner View</h2>

        {myOrder ? (
          <div className="partner-card">
            <h3>Assigned Order: {myOrder.orderId}</h3>
            <p className="order-details"><strong>Items:</strong> {myOrder.items}</p>
            <p className="order-details"><strong>Prep Time:</strong> {myOrder.prepTime} min</p>

            <div className="status-row">
              <strong>Status:</strong>
              {renderStatus(myOrder.status)}
            </div>

            <div className="action-area">
              {actionBtn}
            </div>
          </div>
        ) : (
          <div className="partner-card empty">
            <h3>No Active Orders</h3>
            <p>You have no pending deliveries.</p>
          </div>
        )}
      </div>
    );
  };


  // --- LOGIN VIEW ---
  if (!user) {
    return (
      <div className="login-wrapper">
        <div className="main-header">
          <div className="logo-box">Z</div>
          <h1>Zomato Ops Pro – Smart Kitchen + Delivery Hub</h1>
        </div>

        <div className="login-card">
          <h2>Zomato Ops Pro Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button type="submit" className="login-btn">LOGIN</button>
          </form>

          <div className="credentials-hint">
            <p><strong>Manager:</strong> manager / manager123</p>
            <p><strong>Rider:</strong> rider1 / rider123, rider2 / rider123, rider3 / rider123</p>
          </div>
        </div>
      </div>
    );
  }

  // --- MANAGER VIEW ---
  if (user.role === 'manager') {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Restaurant Manager Dashboard</h1>
          <button className="logout-btn" onClick={() => setUser(null)}>LOGOUT</button>
        </header>

        <div className="add-order-bar">
          <div className="input-group">
            <label>Order ID</label>
            <input
              type="text"
              placeholder="Order ID"
              value={newOrder.orderId}
              onChange={(e) => setNewOrder({ ...newOrder, orderId: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Items</label>
            <input
              type="text"
              placeholder="Items"
              value={newOrder.items}
              onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Prep Time (min)</label>
            <input
              type="number"
              placeholder="Prep Time"
              value={newOrder.prepTime}
              onChange={(e) => setNewOrder({ ...newOrder, prepTime: e.target.value })}
            />
          </div>
          <button className="add-btn" onClick={handleCreateOrder}>ADD ORDER</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Prep Time</th>
                <th>Status</th>
                <th>Assigned Partner</th>
                <th>Dispatch Time</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.items}</td>
                  <td>{order.prepTime} min</td>
                  <td>
                    {renderStatus(order.status)}
                  </td>
                  <td>{order.assignedPartner ? `Rider ${order.assignedPartner}` : '-'}</td>
                  <td>{order.dispatchTime ? `${order.dispatchTime} min` : '-'}</td>
                  <td>
                    {order.status === 'PREP' ? (
                      <select
                        className="assign-dropdown"
                        value=""
                        onChange={(e) => assignOrder(order.orderId, e.target.value)}
                      >
                        <option value="" disabled selected>Select</option>
                        <option value="1">Rider 1</option>
                        <option value="2">Rider 2</option>
                        <option value="3">Rider 3</option>
                      </select>
                    ) : (
                      <span className="assigned-label">Assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- PARTNER VIEW (Delegated) ---
  if (user.role === 'partner') {
    // Find order (logic repeated for render scope)
    const myOrder = orders.find(o => o.assignedPartner === user.partnerId && o.status !== 'DELIVERED');
    let actionBtn = null;

    if (myOrder) {
      // ... (same button logic as before) ...
      if (myOrder.status === 'PREP') {
        actionBtn = <button className="big-action-btn" onClick={() => updateOrderStatus(myOrder.orderId, 'PICKED')}>MARK AS PICKED</button>;
      } else if (myOrder.status === 'PICKED') {
        actionBtn = <button className="big-action-btn" onClick={() => updateOrderStatus(myOrder.orderId, 'ON_ROUTE')}>START DELIVERY</button>;
      } else if (myOrder.status === 'ON_ROUTE') {
        actionBtn = <button className="big-action-btn" onClick={() => updateOrderStatus(myOrder.orderId, 'DELIVERED')}>MARK AS DELIVERED</button>;
      }
    }

    return (
      <div className="app-container">
        {/* Global Header */}
        <div className="main-header" style={{ marginBottom: '20px', width: 'auto', display: 'inline-flex' }}>
          <div className="logo-box">Z</div>
          <h1>Zomato Ops Pro – Smart Kitchen + Delivery Hub</h1>
        </div>

        {/* Partner Section Card */}
        <div className="partner-section-card">
          <div className="partner-header">
            <h2>Delivery Partner View</h2>
            <button className="logout-btn" onClick={() => setUser(null)}>LOGOUT</button>
          </div>

          {myOrder ? (
            <div className="partner-active-order">
              <h3>Assigned Order: {myOrder.orderId}</h3>
              <p className="order-details"><strong>Items:</strong> {myOrder.items}</p>
              <p className="order-details"><strong>Prep Time:</strong> {myOrder.prepTime} min</p>

              <div className="status-row">
                <strong>Status:</strong>
                {renderStatus(myOrder.status)}
              </div>

              <div className="action-area">
                {actionBtn}
              </div>
            </div>
          ) : (
            <div className="info-banner">
              <span className="info-icon">ⓘ</span>
              No assigned order. You are available.
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
