const socket = io();
const prods = document.getElementById('prods');
const pagination = document.getElementById('pagination');
let currentUrl = "/api/products/all"
let cartID = ""
const cartDiv = document.getElementById('cart');

function createProductDescription(product) {
  const p = document.createElement("p");
  p.textContent = `\n • ${product.description}\n • ${product.category}\n • ${product.stock}`;
  p.style.whiteSpace = "pre-line";
  return p;
}

function createProductTitle(product) {
  const h = document.createElement("h3");
  h.textContent = `${product.title} \t $${product.price}`;
  h.style.whiteSpace = "pre-line";
  return h;
}

function addToCartBTN(pid) {
  const btn = document.createElement("button");
  btn.id = pid;
  btn.textContent = "+";
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
    const response = await fetch(`/api/carts/${cartID}/product/${pid}?socket=${socket.id}`, {
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
    console.log(url)
    const response = await fetch(`${url}?sort=asc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const products = await response.json();
    console.log("nextLink:", products.nextLink);

    prods.innerHTML = "";
    products.payload.forEach(p => {
      const div = createProductDiv(p);
      prods.appendChild(div);
    });

    pagination.innerHTML = "";

    if (products.prevLink) {
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "🡰";
      prevBtn.onclick = () => getProducts(products.prevLink);
      pagination.appendChild(prevBtn);
    } else {
      const span = document.createElement("span");
      pagination.appendChild(span);
    }

    if (products.nextLink) {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "🡲";
      nextBtn.onclick = () => getProducts(products.nextLink);
      pagination.appendChild(nextBtn);
    }


  } catch (err) {
    console.error("Error en la solicitud fetch:", err);
  }
}

async function getCart(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`);
    if (!response.ok) throw new Error("Error al obtener el carrito");

    const products = await response.json();
    const cartDiv = document.getElementById("cart");

    cartDiv.innerHTML = "<h3>🛒 Carrito</h3>";
    let total = 0;
    if (!products || products.length === 0) {
      cartDiv.innerHTML += "<p>Tu carrito está vacío</p>";
      return;
    }

    const ul = document.createElement("ul");
    products.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.id.title} - $${p.id.price} | cantidad: ${p.quantity}`;
      ul.appendChild(li);
      total += p.id.price * p.quantity;
    });

    cartDiv.appendChild(ul);
    const totalDiv = document.createElement("p");
    totalDiv.style.fontWeight = "bold";
    totalDiv.textContent = `💰 Total: $${total.toFixed(2)}`;
    cartDiv.appendChild(totalDiv);

  } catch (error) {
    console.error("Error cargando carrito:", error);
  }
}


socket.on('alertProduct', (message) => {
  console.log(message);
  getProducts();
});

socket.on('productAdded', (message, cart) => {
  console.log(message, cart._id);
  getCart(cart._id)
});

window.addEventListener("DOMContentLoaded", () => getProducts());
