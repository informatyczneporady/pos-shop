async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  document.getElementById("products").innerHTML = products.map(p =>
    `<div class="product">
      ${p.name} - ${p.price} PLN
      <button onclick="addToCart(${p.id})">Dodaj</button>
    </div>`).join("");
}

async function addToCart(id) {
  await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: id, qty: 1 })
  });
  showCart();
}

async function showCart() {
  const res = await fetch("/api/cart");
  const cart = await res.json();
  document.getElementById("cart").innerHTML = cart.map(c => `Produkt ${c.productId}, ilość: ${c.qty}`).join("<br>");
}

function checkout() {
  document.getElementById("paymentModal").style.display = "block";
}

async function confirmPayment() {
  const method = document.getElementById("paymentMethod").value;
  await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId: 1, total: 100, payment: method, delivery: "Kraków Centrum" })
  });
  alert("Zamówienie zapisane!");
  document.getElementById("paymentModal").style.display = "none";
}

loadProducts();
