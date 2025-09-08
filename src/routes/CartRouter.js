import { Router } from "express";
import { cartManager } from "../manager/CartManager.js";
const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const { page, limit, sort } = req.query;
        const filter = req.body;
        const response = await cartManager.getCarts(page, limit, filter, sort);
        const nextPage = response.hasNextPage
            ? `http://localhost:8080/api/carts?page=${response.nextPage}`
            : null;
        const prevPage = response.hasPrevPage
            ? `http://localhost:8080/api/carts?page=${response.prevPage}`
            : null;
        res.json({
            payload: response.docs,
            count: response.totalDocs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            nextLink: nextPage,
            prevLink: prevPage,
        });
    } catch (error) {
        next(error);
    }
})

router.post("/", async (req, res, next) => {
  try {
    const cart = await cartManager.createCart();
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await cartManager.getProductsFromCart(id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

router.post("/:cid/product/:pid", async (req, res, next) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await cartManager.addProductToCart(cid, pid);
        const io = req.app.get("socketServer");
        io.emit('alertCart', `Se ha añadido el carrito ${cart._id}`);
        res.json(cart);

    } catch (error) {
        next(error);
    }
});

export default router;
