const socket = io();
const socketLocal = localStorage.getItem("socketId");
const cart = document.getElementById("cart");
const cartId = cart.dataset.id;

function createProductDescription(product) {
    const p = document.createElement("p");
    p.textContent = `\n • ${product.id.description}\n • ${product.id.category}\n • ${product.id.stock}`;
    p.style.whiteSpace = "pre-line";
    return p;
}

function createProductTitle(product) {
    const h = document.createElement("h3");
    console.log(product)
    h.textContent = `${product.id.title} \t $${product.id.price} \n Cantidad: ${product.quantity}`;
    h.style.whiteSpace = "pre-line";
    return h;
}

function createProductDiv(product) {
    const div = document.createElement("div");
    div.appendChild(createProductTitle(product))
    div.appendChild(createProductDescription(product));
    return div;
}

async function getProductsFromCart() {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const products = await response.json();

        const cartContainer = document.getElementById("cart");
        cartContainer.innerHTML = "";

        products.forEach(p => {
            const div = createProductDiv(p);
            cartContainer.appendChild(div);
        });

    } catch (err) {
        console.error("Error en la solicitud fetch:", err);
    }
}

const btn = document.getElementById("refresh");

btn.addEventListener("click", async () => {
    try {
        getProductsFromCart()
    } catch (err) {
        console.error("Error al refrescar el carrito:", err);
    }
});


document.addEventListener("DOMContentLoaded", () => {
    getProductsFromCart()
});
