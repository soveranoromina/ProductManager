import { Router } from "express";
import { productManager } from "../manager/ProductManager.js"
const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const { page, limit, sort } = req.query;
        const filter = req.body;
        const response = await productManager.getProducts(page, limit, filter, sort);
        const nextPage = response.hasNextPage
            ? `http://localhost:8080/api/products?page=${response.nextPage}`
            : null;
        const prevPage = response.hasPrevPage
            ? `http://localhost:8080/api/products?page=${response.prevPage}`
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
        console.log(req.params, req.body)
        const { id } = req.params;
        const updatedProduct = req.body
        const product = await productManager.updateProduct(id, updatedProduct);
        const io = req.app.get("socketServer");
        const { socketId } = req.body;
        if (socketId) {
            io.to(socketId).emit('updatedProduct', product);
        }
        io.emit('alertProduct', `Se ha actualizado el producto ${product._id}`);
        res.json(product)
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
