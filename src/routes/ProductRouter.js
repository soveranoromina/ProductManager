import { Router } from "express";
import { productManager } from "../manager/ProductManager.js"
const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
})

router.post("/", async (req, res, next) => {
    try {
        const product = await productManager.addProduct(req.body);

        const io = req.app.get("socketServer");
        const { socketId } = req.body;
        if (socketId) {
            io.to(socketId).emit('newProduct', product);
        }
        io.emit('alertProduct', `Se ha añadido el producto ${product._id}`);

        res.json(product);
    } catch (error) {
        next(error);
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        next(error);
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProduct = req.body
        const product = await productManager.updateProduct(id, updatedProduct);
        res.json(product);
    } catch (error) {
        next(error);
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productManager.deleteProduct(id);
        console.log(product)
        const io = req.app.get("socketServer");
        const { socketId } = req.body;
        if (socketId) {
            io.to(socketId).emit('deletedProduct', 'Producto eliminado');
        }
        io.emit('alertProduct');

        res.json(product);

    } catch (error) {
        next(error);
    }
})

export default router;
