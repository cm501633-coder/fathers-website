require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (furst.html, style.css, script.js)
app.use(express.static(__dirname));

// PostgreSQL Connection Pool Setup
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    }
  : {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'father_website',
      password: process.env.PGPASSWORD || 'password',
      port: process.env.PGPORT || 5432,
    };

const pool = new Pool(poolConfig);

// Initialize the database table on startup
async function initDB() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(200) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log('✅ PostgreSQL connected: "messages" table is ready.');
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection failed:', err.message);
    console.warn('👉 Update your database credentials in the .env file.');
  }
}

// Routes
// 1. Root route: serve index.html (or furst.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin route: view inquiries dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// 2. API route: Submit contact form to PostgreSQL
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required.'
    });
  }

  const insertQuery = `
    INSERT INTO messages (name, email, phone, message)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, created_at;
  `;

  try {
    const result = await pool.query(insertQuery, [name, email, phone || null, message]);
    res.status(201).json({
      success: true,
      message: 'Inquiry saved successfully!',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error inserting message into PostgreSQL:', err);
    res.status(500).json({
      success: false,
      error: 'Database error: Could not save message. Check server logs.'
    });
  }
});

// 3. API route: View all messages (for admin/your father)
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, messages: result.rows });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: 'Could not fetch messages.' });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await initDB();
});
