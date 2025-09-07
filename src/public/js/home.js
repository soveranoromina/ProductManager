const socket = io();
const prods = document.getElementById('prods');
const pagination = document.getElementById('pagination');
let currentUrl = "/api/products"

function createProductDescription(product) {
  const p = document.createElement("p");
  p.textContent = `\n -${product.description}\n -${product.category}\n -${product.stock}`;
  p.style.whiteSpace = "pre-line";
  return p;
}

function createProductTitle(product) {
  const h = document.createElement("h3");
  h.textContent = `${product.title}`;
  h.style.whiteSpace = "pre-line";
  return h;
}

function createCartBTN() {
  const h = document.createElement("button");
  h.textContent = `add to cart`;
  h.style.whiteSpace = "inline";
  return h;
}

function createProductDiv(product) {
  const div = document.createElement("div");
  div.appendChild(createProductTitle(product))
  div.appendChild(createProductDescription(product));
  div.appendChild(createCartBTN());
  return div;
}

async function getProducts(url = currentUrl) {
  try {
    currentUrl = url;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const products = await response.json();
    console.log("nextLink:", products.nextLink);

    prods.innerHTML = "";
    products.payload.forEach(p => {
      const div = createProductDiv(p);
      prods.appendChild(div);
    });

    pagination.innerHTML = ""; 
    if (products.nextLink) {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Pagina siguiente >";
      nextBtn.onclick = () => getProducts(products.nextLink); 
      pagination.appendChild(nextBtn);
    }
    if (products.prevLink) {
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "< Pagina anterior";
      prevBtn.onclick = () => getProducts(products.prevLink); 
      pagination.appendChild(prevBtn);
    }

  } catch (err) {
    console.error("Error en la solicitud fetch:", err);
  }
}

socket.on('alertProduct', (message) => {
  console.log(message);
  getProducts();
});

window.addEventListener("DOMContentLoaded", () => getProducts());
