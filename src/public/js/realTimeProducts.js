const socket = io();
const form = document.getElementById('form');
const prods = document.getElementById('prods');
const errorMessage = document.getElementById('errorMessage');

function createProductDiv(product) {
  const div = document.createElement("div");
  div.id = `product-${product._id}`;
  div.appendChild(createProductText(product));
  div.appendChild(createDeleteButton(product, div));
  div.appendChild(createUpdateButton(product, div));
  return div;
}

function createProductText(product) {
  const p = document.createElement("h3");
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
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socketId: socket.id })
    });
    div.remove();
  } catch (err) {
    console.error("Error en el DELETE:", err);
  }
}

function createUpdateButton(product, div) {
  const btn = document.createElement("button");
  btn.textContent = "Actualizar";
  btn.addEventListener("click", () => showUpdateForm(product, div));
  return btn;
}

function showUpdateForm(product, div) {
  if (div.querySelector("form")) return;

  const actionButtons = div.querySelectorAll("button");
  actionButtons.forEach(btn => btn.style.display = "none");

  const actionH3 = div.querySelectorAll("h3");
  actionH3.forEach(H3 => H3.style.display = "none");

  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.gap = "8px";
  form.style.marginTop = "10px";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title: ";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = product.title || "";
  titleLabel.appendChild(titleInput);

  const descLabel = document.createElement("label");
  descLabel.textContent = "Description: ";
  const descInput = document.createElement("input");
  descInput.type = "text";
  descInput.value = product.description || "";
  descLabel.appendChild(descInput);

  const codeLabel = document.createElement("label");
  codeLabel.textContent = "Code: ";
  const codeInput = document.createElement("input");
  codeInput.type = "text";
  codeInput.value = product.code || "";
  codeLabel.appendChild(codeInput);

  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Price: ";
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.value = product.price || 0;
  priceLabel.appendChild(priceInput);

  const statusLabel = document.createElement("label");
  statusLabel.textContent = "Status: ";
  const statusInput = document.createElement("input");
  statusInput.type = "checkbox";
  statusInput.checked = product.status || false;
  statusLabel.appendChild(statusInput);

  const stockLabel = document.createElement("label");
  stockLabel.textContent = "Stock: ";
  const stockInput = document.createElement("input");
  stockInput.type = "number";
  stockInput.value = product.stock || 0;
  stockLabel.appendChild(stockInput);

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Category: ";
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.value = product.category || "";
  categoryLabel.appendChild(categoryInput);

  const thumbLabel = document.createElement("label");
  thumbLabel.textContent = "Thumbnails: ";
  const thumbInput = document.createElement("input");
  thumbInput.type = "text";
  thumbInput.value = (product.thumbnails || []).join(", ");
  thumbLabel.appendChild(thumbInput);

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.textContent = "Send";

  form.appendChild(titleLabel);
  form.appendChild(descLabel);
  form.appendChild(codeLabel);
  form.appendChild(priceLabel);
  form.appendChild(statusLabel);
  form.appendChild(stockLabel);
  form.appendChild(categoryLabel);
  form.appendChild(thumbLabel);
  form.appendChild(saveBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      title: titleInput.value,
      description: descInput.value,
      code: codeInput.value,
      price: Number(priceInput.value),
      status: statusInput.checked,
      stock: Number(stockInput.value),
      category: categoryInput.value,
      thumbnails: thumbInput.value.split(",").map(url => url.trim()).filter(url => url !== "")
    };

    await updateProduct(product._id, data);

    form.remove();
    actionButtons.forEach(btn => btn.style.display = "inline-block");
    actionH3.forEach(H3 => H3.style.display = "inline-block");
  });

  div.appendChild(form);
}

async function updateProduct(id, updatedData) {
  try {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedData, socketId: socket.id })
    })
  } catch (err) {
    console.error("Error en el UPDATE:", err);
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

socket.on('updatedProduct', (product) => {
  const existingDiv = document.getElementById(`product-${product._id}`);
  if (existingDiv) {
    existingDiv.querySelector("h3").textContent = `${product.title} - $${product.price}`;
  } else {
    const div = createProductDiv(product);
    prods.appendChild(div);
  }
});

socket.on('deletedProduct', (message) => {
  console.log(message)
});

