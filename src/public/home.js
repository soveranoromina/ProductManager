const socket = io();
const prods = document.getElementById('prods');

function createProductText(product) {
  const p = document.createElement("p");
  p.textContent = `${product.title} - $${product.price}`;
  return p;
}

async function getProducts() {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const products = await response.json();
      console.log(products)

    prods.innerHTML = "";

    products.forEach(p => {
      const div = createProductText(p);
      prods.appendChild(div);
    });

  } catch (err) {
    console.error("Error en la solicitud fetch:", err);
  }
}

socket.on('product', () => {
  getProducts();
});

window.addEventListener("DOMContentLoaded", getProducts);
