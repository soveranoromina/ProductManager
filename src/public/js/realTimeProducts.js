const socket = io();
const form = document.getElementById('form');
const prods = document.getElementById('prods');
const errorMessage = document.getElementById('errorMessage');

function createProductDiv(product) {
  const div = document.createElement("div");
  div.id = `product-${product._id}`;
  div.appendChild(createProductText(product));
  div.appendChild(createDeleteButton(product, div));
  return div;
}

function createProductText(product) {
  const p = document.createElement("p");
  p.textContent = `${product.title} - $${product.price}`;
  return p;
}

function createDeleteButton(product, div) {
  const btn = document.createElement("button");
  btn.textContent = "Eliminar";
  btn.addEventListener("click", async () => await deleteProduct(product._id, div));
  return btn;
}

async function deleteProduct(id, div) {
  try {
    console.log(id)
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socketId: socket.id })
    });
    div.remove();
  } catch (err) {
    console.error("Error en el DELETE:", err);
  }
}

function createMessageText(message) {
  const m = document.createElement("p");
  m.textContent = `${message}`;
  return m;
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
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, socketId: socket.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = `Error del backend: ${errorData.message}`

      const messageElement = createMessageText(message);
      errorMessage.appendChild(messageElement);

      setTimeout(() => {
        errorMessage.removeChild(messageElement);
      }, 2000);
      return;
    }
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

