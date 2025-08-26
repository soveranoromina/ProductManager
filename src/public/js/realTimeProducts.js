const socket = io();
const form = document.getElementById('form');
const prods = document.getElementById('prods');

function createProductDiv(product) {
  const div = document.createElement("div");
  div.id = `product-${product.product.id}`;
  div.appendChild(createProductText(product));
  div.appendChild(createDeleteButton(product, div));
  return div;
}

function createProductText(product) {
  const p = document.createElement("p");
  p.textContent = `${product.product.title} - $${product.product.price}`;
  return p;
}

function createDeleteButton(product, div) {
  const btn = document.createElement("button");
  btn.textContent = "Eliminar";
  btn.addEventListener("click", async () => await deleteProduct(product.product.id, div));
  return btn;
}

async function deleteProduct(id, div) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({socketId: socket.id})
    });
    div.remove();
  } catch (err) {
    console.error("Error en el DELETE:", err);
  }
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: Number(document.getElementById("price").value),
    status: document.getElementById("status").checked,
    stock: Number(document.getElementById("stock").value),
    category: document.getElementById("category").value,
    thumbnails: document.getElementById("thumbnails").value.split(",").map(url => url.trim()).filter(url => url !== "")   
  };
  try {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, socketId: socket.id }),
    })
  } catch (err) {
    console.error("Error en el POST:", err);
  }
};

socket.on('newProduct', (product) => {
  const div = createProductDiv(product);
  prods.appendChild(div);
});

socket.on('deletedProduct', (message) => {
  console.log(message)
});