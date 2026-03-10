const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Read email credentials from credentials.txt
let emailCredentials = { email: '', password: '' };
try {
  const credentialsPath = path.join(__dirname, 'credentials.txt');
  const credentialsContent = fs.readFileSync(credentialsPath, 'utf-8');
  const lines = credentialsContent.trim().split('\n');
  emailCredentials.email = lines[0];
  emailCredentials.password = lines[1].replace('pass:', '').trim();
} catch (error) {
  console.error('Error reading credentials:', error);
}

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailCredentials.email,
    pass: emailCredentials.password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
  logging: false
});

// Models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: false
});

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'reviews',
  timestamps: false
});

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: false
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

// Relationships
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Seed data
const seedProducts = [
  {id: 1, name: "Flawless Foundation", category: "Foundation", price: 2999, image: "https://via.placeholder.com/300x300?text=Flawless+Foundation", description: "Long-lasting, full-coverage foundation that provides a smooth and even skin tone.", rating: 4.5},
  {id: 2, name: "Glow Primer", category: "Primers", price: 1599, image: "https://via.placeholder.com/300x300?text=Glow+Primer", description: "Creates a smooth base for perfect makeup application and extends wear time.", rating: 4.7},
  {id: 3, name: "Shimmer Highlighter", category: "Highlighters", price: 1299, image: "https://via.placeholder.com/300x300?text=Shimmer+Highlighter", description: "Adds a radiant glow and luminosity to your skin.", rating: 4.6},
  {id: 4, name: "Blushing Pink Blush", category: "Blush", price: 999, image: "https://via.placeholder.com/300x300?text=Blush", description: "Natural-looking blush that adds a healthy flush to your cheeks.", rating: 4.4},
  {id: 5, name: "Classic Red Lipstick", category: "Lipstick", price: 799, image: "https://via.placeholder.com/300x300?text=Red+Lipstick", description: "Iconic red lipstick with long-lasting color and comfortable wear.", rating: 4.8},
  {id: 6, name: "Matte Lipstick Nude", category: "Lipstick", price: 799, image: "https://via.placeholder.com/300x300?text=Nude+Lipstick", description: "Stunning nude shade for everyday elegance.", rating: 4.3},
  {id: 7, name: "Waterproof Eyeliner", category: "Eyeliner", price: 599, image: "https://via.placeholder.com/300x300?text=Eyeliner", description: "Precise application with waterproof formula that lasts all day.", rating: 4.5},
  {id: 8, name: "Volumizing Mascara", category: "Mascara", price: 899, image: "https://via.placeholder.com/300x300?text=Mascara", description: "Builds volume and definition for dramatic lashes.", rating: 4.6},
  {id: 9, name: "Eyeshadow Palette", category: "Eyeshadow", price: 1899, image: "https://via.placeholder.com/300x300?text=Eyeshadow+Palette", description: "12 stunning shades for endless eye looks.", rating: 4.7},
  {id: 10, name: "Setting Spray", category: "Setting", price: 1099, image: "https://via.placeholder.com/300x300?text=Setting+Spray", description: "Keep your makeup fresh all day with our long-lasting setting spray.", rating: 4.4},
  {id: 11, name: "Powder Brush Set", category: "Brushes", price: 1499, image: "https://via.placeholder.com/300x300?text=Brush+Set", description: "Professional makeup brush set with 5 essential brushes.", rating: 4.5},
  {id: 12, name: "Makeup Remover Oil", category: "Skincare", price: 799, image: "https://via.placeholder.com/300x300?text=Remover+Oil", description: "Gentle makeup remover that also nourishes the skin.", rating: 4.6}
];

// Function to send confirmation email
async function sendConfirmationEmail(email, orderId, orderDetails) {
  try {
    const itemsList = orderDetails.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background: linear-gradient(135deg, #ec407a, #ff6ec4); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; }
          .order-section { margin: 20px 0; }
          .order-section h3 { color: #ec407a; border-bottom: 2px solid #ec407a; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #f5f5f5; padding: 10px; text-align: left; font-weight: bold; }
          .price-section { margin: 20px 0; text-align: right; }
          .price-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .total { font-weight: bold; font-size: 1.2em; color: #ec407a; padding-top: 10px; border-top: 2px solid #ec407a; }
          .footer { background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; font-size: 0.9em; border-radius: 0 0 5px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💄 Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <div class="content">
            <p>Hi ${orderDetails.shippingAddress?.firstName || 'Customer'},</p>
            <p>Your order has been placed successfully. Here are your order details:</p>
            
            <div class="order-section">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">PENDING</span></p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            
            <div class="order-section">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th>Product</th>
                    <th style="text-align: center;">Price</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
            </div>
            
            <div class="order-section">
              <h3>Shipping Address</h3>
              <p>
                ${orderDetails.shippingAddress?.firstName} ${orderDetails.shippingAddress?.lastName}<br>
                ${orderDetails.shippingAddress?.address}<br>
                ${orderDetails.shippingAddress?.city}, ${orderDetails.shippingAddress?.state} ${orderDetails.shippingAddress?.zipcode}<br>
                ${orderDetails.shippingAddress?.country}<br>
                Phone: ${orderDetails.shippingAddress?.phone}
              </p>
            </div>
            
            <div class="price-section">
              <div class="price-row">
                <span>Subtotal:</span>
                <span>₹${orderDetails.subtotal}</span>
              </div>
              <div class="price-row">
                <span>Shipping (${orderDetails.shippingMethod}):</span>
                <span>₹${orderDetails.shippingCost}</span>
              </div>
              <div class="price-row">
                <span>Tax (10%):</span>
                <span>₹${orderDetails.tax}</span>
              </div>
              <div class="price-row total">
                <span>Total Amount:</span>
                <span>₹${orderDetails.total}</span>
              </div>
            </div>
            
            <div class="order-section">
              <h3>Payment Method</h3>
              <p>${orderDetails.paymentMethod}</p>
            </div>
            
            <p style="margin-top: 30px; color: #666;">You can track your order in your account dashboard. We'll send you updates on your order status.</p>
            <p style="color: #666;">Thank you for choosing Beauty Cosmetics!</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 Beauty Cosmetics. All rights reserved.</p>
            <p>For support, contact us at ${emailCredentials.email}</p>
          </div>
        </div>
      </body>
    </html>
    `;

    const mailOptions = {
      from: emailCredentials.email,
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Initialize database
async function initDB() {
  try {
    // Sync database without dropping existing tables
    await sequelize.sync({ alter: false });
    
    // Create default admin user
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        is_admin: true
      });
    }
    
    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate(seedProducts);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Debug endpoint to check orders in database
app.get('/api/debug/orders', async (req, res) => {
  try {
    const allOrders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      raw: false
    });
    
    console.log('Debug - Total orders in DB:', allOrders.length);
    
    res.json({
      totalCount: allOrders.length,
      orders: allOrders.map(o => ({
        id: o.id,
        email: o.email,
        user_id: o.user_id,
        status: o.status,
        date: o.date,
        items: o.items ? o.items.length : 0
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Debug - create a test order
app.post('/api/debug/test-order', async (req, res) => {
  try {
    const testOrderId = `TEST-${Date.now()}`;
    const order = await Order.create({
      id: testOrderId,
      user_id: '1',
      email: 'test@example.com',
      payment_method: 'card',
      shipping_method: 'standard',
      shipping_address: JSON.stringify({ city: 'Test City' }),
      total: 100,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    
    console.log('Test order created:', testOrderId);
    
    const verified = await Order.findByPk(testOrderId);
    console.log('Test order verified:', verified ? 'FOUND' : 'NOT FOUND');
    
    res.json({ 
      message: 'Test order created',
      orderId: testOrderId,
      verified: verified ? 'YES' : 'NO'
    });
  } catch (error) {
    console.error('Test order error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ detail: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password, is_admin: false });
    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.is_admin 
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }
    
    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.is_admin 
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/api/auth/admin', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (password !== 'admin123') {
      return res.status(401).json({ detail: 'Incorrect admin password' });
    }
    
    res.json({ 
      id: 'admin', 
      name: 'Admin', 
      email: 'admin@cosmetic.com', 
      isAdmin: true 
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    const result = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isAdmin: u.is_admin
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Category routes
app.get('/api/categories', async (req, res) => {
  try {
    const products = await Product.findAll();
    const categories = [...new Set(products.map(p => p.category))].sort();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Review,
        as: 'reviews',
        attributes: ['id', 'author', 'rating', 'text']
      }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.get('/api/products/:product_id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id, {
      include: [{
        model: Review,
        as: 'reviews',
        attributes: ['id', 'author', 'rating', 'text']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ detail: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, image, description, rating } = req.body;
    const product = await Product.create({ name, category, price, image, description, rating: rating || 0 });
    res.json(product);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.put('/api/products/:product_id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (!product) {
      return res.status(404).json({ detail: 'Product not found' });
    }
    
    const { name, category, price, image, description, rating } = req.body;
    await product.update({ name, category, price, image, description, rating });
    res.json(product);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.delete('/api/products/:product_id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (!product) {
      return res.status(404).json({ detail: 'Product not found' });
    }
    
    await product.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Review routes
app.post('/api/products/:product_id/reviews', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id, {
      include: [{
        model: Review,
        as: 'reviews'
      }]
    });
    
    if (!product) {
      return res.status(404).json({ detail: 'Product not found' });
    }
    
    const { author, rating, text } = req.body;
    await Review.create({
      product_id: req.params.product_id,
      author,
      rating,
      text
    });
    
    // Update average rating
    const reviews = await Review.findAll({ where: { product_id: req.params.product_id } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await product.update({ rating: avgRating });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Order routes
app.get('/api/orders', async (req, res) => {
  try {
    const { user_id } = req.query;
    const where = user_id ? { user_id } : {};
    
    const orders = await Order.findAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['date', 'DESC']]
    });
    
    const result = orders.map(o => ({
      id: o.id,
      date: o.date,
      user_id: o.user_id,
      email: o.email,
      payment_method: o.payment_method,
      shipping_method: o.shipping_method,
      shipping_address: JSON.parse(o.shipping_address),
      total: o.total,
      status: o.status,
      items: o.items.map(i => ({
        product_id: i.product_id,
        name: i.name,
        category: i.category,
        price: i.price,
        quantity: i.quantity
      }))
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.get('/api/orders/:order_id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.order_id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });
    
    if (!order) {
      return res.status(404).json({ detail: 'Order not found' });
    }
    
    const result = {
      id: order.id,
      date: order.date,
      user_id: order.user_id,
      email: order.email,
      payment_method: order.payment_method,
      shipping_method: order.shipping_method,
      shipping_address: JSON.parse(order.shipping_address),
      total: order.total,
      status: order.status,
      items: order.items.map(i => ({
        product_id: i.product_id,
        name: i.name,
        category: i.category,
        price: i.price,
        quantity: i.quantity
      }))
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
    try {
      const { user_id, email, paymentMethod, shippingMethod, shippingAddress, items } = req.body;
      
      console.log('Order request received:', { user_id, email, itemCount: items.length });
      
      // Price lookup
      const products = await Product.findAll();
      const productMap = {};
      products.forEach(p => { productMap[p.id] = p; });
      
      let subtotal = 0;
      const itemsData = [];
      
      for (const item of items) {
        if (!productMap[item.product_id]) {
          return res.status(400).json({ detail: `Product ${item.product_id} not found` });
        }
        
        const prod = productMap[item.product_id];
        const lineTotal = prod.price * item.quantity;
        subtotal += lineTotal;
        
        itemsData.push({
          product_id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          quantity: item.quantity
        });
      }
      
      const shippingCost = shippingMethod === 'express' ? 300 : 100;
      const tax = Math.round(subtotal * 0.1);
      const total = subtotal + shippingCost + tax;
      
      const orderId = `ORD-${Date.now()}`;
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Create order first
      const order = await Order.create({
        id: orderId,
        user_id: user_id || null,
        email,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        shipping_address: JSON.stringify(shippingAddress),
        total,
        status: 'Pending',
        date: currentDate
      });
      
      console.log('Order created in DB:', { id: orderId, email, user_id });
      
      // Verify order was saved
      const savedOrder = await Order.findByPk(orderId);
      console.log('Order verification:', savedOrder ? 'FOUND' : 'NOT FOUND');
      
      // Create order items
      for (const item of itemsData) {
        await OrderItem.create({
          order_id: orderId,
          ...item
        });
      }
      
      console.log('Order items created for:', orderId);
      
      // Send confirmation email (non-blocking)
      sendConfirmationEmail(email, orderId, {
        items: itemsData,
        shippingAddress,
        paymentMethod,
        shippingMethod,
        subtotal,
        shippingCost,
        tax,
        total
      }).catch(err => {
        console.error('Failed to send email:', err.message);
      });
      
      console.log('Response sent for order:', orderId);
      res.json({ id: orderId, total, status: 'Pending' });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ detail: error.message });
    }
  });
  
  app.put('/api/orders/:order_id/status', async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.order_id);
      if (!order) {
        return res.status(404).json({ detail: 'Order not found' });
      }
      
      const { status } = req.body;
      await order.update({ status });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  });
  
  app.delete('/api/orders/:order_id', async (req, res) => {
    const orderId = req.params.order_id;
    try {
      const order = await Order.findByPk(orderId, { include: [{ model: OrderItem, as: 'items' }] });
      if (!order) {
        return res.status(404).json({ detail: 'Order not found' });
      }
  
      // Delete child items first to satisfy SQLite FK constraints
      await sequelize.transaction(async (t) => {
        await OrderItem.destroy({ where: { order_id: orderId }, transaction: t });
        await Order.destroy({ where: { id: orderId }, transaction: t });
      });
  
      res.json({ success: true });
    } catch (error) {
      console.error('Order delete error:', error);
      res.status(500).json({ detail: error.message || 'Failed to delete order' });
    }
  });
  
  
  
  
// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});


// End of server.js