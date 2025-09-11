import { Router } from "express";
import { productManager } from "../manager/ProductManager.js"
const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const { page, limit, sort, category, status } = req.query;
        const response = await productManager.getProducts(page, limit, sort, category, status);
        const nextPage = response.hasNextPage
            ? `http://localhost:8080/api/products/all?page=${response.nextPage}`
            : null;
        const prevPage = response.hasPrevPage
            ? `http://localhost:8080/api/products/all?page=${response.prevPage}`
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

router.get("/:id", async (req, res, next) => {
    try {
        ;
        const product = await productManager.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        next(error);
    }
})

router.post("/", async (req, res, next) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.json(product);
        const io = req.app.get("socketServer");
        const { socketId } = req.body;
        if (socketId) {
            io.to(socketId).emit('newProduct', product);
        }
        io.emit('alertProduct', `Se ha añadido el producto ${product._id}`);
    } catch (error) {
        next(error);
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const product = await productManager.updateProduct(req.params.id, req.body);
        res.json(product)
        const io = req.app.get("socketServer");
        const { socketId } = req.body;
        if (socketId) {
            io.to(socketId).emit('updatedProduct', product);
        }
        io.emit('alertProduct', `Se ha actualizado el producto ${product._id}`);
    } catch (error) {
        next(error);
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const product = await productManager.deleteProduct(req.params.id);
        res.json(product);
        const io = req.app.get("socketServer");
        const { socketId } = req.body;
        if (socketId) {
            io.to(socketId).emit('deletedProduct', 'Producto eliminado');
        }
        io.emit('alertProduct');
    } catch (error) {
        next(error);
    }
})

export default router;
