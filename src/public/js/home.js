const socket = io();
const prods = document.getElementById('prods');

function createProductText(product) {
  const p = document.createElement("p");
  p.textContent = `${product.title} - $${product.price}`;
  return p;
}

function createProductDiv(product) {
  const div = document.createElement("div");
  div.appendChild(createProductText(product));
  return div;
}

async function getProducts() {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const products = await response.json();
    console.log(products);

    prods.innerHTML = "";

    products.forEach(p => {
      const div = createProductDiv(p);
      prods.appendChild(div);
    });

  } catch (err) {
    console.error("Error en la solicitud fetch:", err);
  }
}

socket.on('alertProduct', (message) => {
  console.log(message)
  getProducts();
});

window.addEventListener("DOMContentLoaded", getProducts);
