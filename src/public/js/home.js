const socket = io();
const prods = document.getElementById('prods');
const pagination = document.getElementById('pagination');
let currentUrl = "/api/products"
let cartID = ""

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

function addToCartBTN(pid) {
  const btn = document.createElement("button");
  btn.id = pid;
  btn.textContent = "add to cart";
  btn.style.whiteSpace = "inline";

  btn.addEventListener("click", async () => {
    if (cartID === "") {
      cartID = await createCart();
      console.log("Carrito creado:", cartID);
    }
    await addProductToCart(pid);
  });

  return btn;
}

async function createCart() {
  try {
    const response = await fetch(`/api/carts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    return data._id;
  } catch (err) {
    console.error("Error en el CREATE:", err);
  }
}

async function addProductToCart(pid) {
  try {
    const response = await fetch(`/api/carts/${cartID}/product/${pid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    console.log("Producto agregado:", data);
  } catch (err) {
    console.error("Error en el UPDATE:", err);
  }
}

function createProductDiv(product) {
  const div = document.createElement("div");
  div.appendChild(createProductTitle(product))
  div.appendChild(createProductDescription(product));
  div.appendChild(addToCartBTN(product._id));
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
