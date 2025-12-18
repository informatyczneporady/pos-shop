const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL, stock INTEGER, cost REAL)");
  db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, points INTEGER)");
  db.run("CREATE TABLE orders (id INTEGER PRIMARY KEY, customerId INTEGER, total REAL, date TEXT, payment TEXT, delivery TEXT)");
  db.run("CREATE TABLE suppliers (id INTEGER PRIMARY KEY, name TEXT, phone TEXT)");
});

let cart = [];

// Koszyk
app.post("/api/cart/add", (req, res) => {
  const { productId, qty } = req.body;
  cart.push({ productId, qty });
  res.json(cart);
});
app.post("/api/cart/update", (req, res) => {
  const { productId, qty } = req.body;
  cart = cart.map(c => c.productId === productId ? { ...c, qty } : c);
  res.json(cart);
});
app.get("/api/cart", (req, res) => res.json(cart));

// Zamówienia
app.post("/api/orders", (req, res) => {
  const { customerId, total, payment, delivery } = req.body;
  const date = new Date().toISOString();
  db.run("INSERT INTO orders (customerId, total, date, payment, delivery) VALUES (?, ?, ?, ?, ?)",
    [customerId, total, date, payment, delivery]);
  cart = [];
  res.json({ status: "order saved" });
});

// Produkty
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => res.json(rows));
});
app.post("/api/products", (req, res) => {
  const { name, category, price, stock, cost } = req.body;
  db.run("INSERT INTO products (name, category, price, stock, cost) VALUES (?, ?, ?, ?, ?)", [name, category, price, stock, cost]);
  res.json({ status: "ok" });
});

app.listen(PORT, () => console.log(`POS backend running on ${PORT}`));
