import { Router } from "express"
import { cartManager } from "../manager/CartManager.js"
const router = Router()

router.get("/:id", async (req, res, next) => {
  try {
    const cart = await cartManager.getProductsFromCart(req.params.id)
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const cart = await cartManager.createCart()
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

router.post("/:cid/product/:pid", async (req, res, next) => {
  try {

    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, req.query.quantity)
    res.json(cart)
    const io = req.app.get("socketServer")
    const socketId = req.query.socket
    if (socketId) {
      io.to(socketId).emit('productAdded', `Producto con el id ${req.params.pid} agregado al carrito ${req.params.cid}`, cart)
    }
  } catch (error) {
    next(error)
  }
})

router.put("/:cid", async (req, res, next) => {
  try {
    const cart = await cartManager.updateProductsFromCart(req.params.cid, req.body)
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

router.delete("/:cid/product/:pid", async (req, res, next) => {
  try {

    const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid, req.query.quantity)
    res.json(cart)
    const io = req.app.get("socketServer")
    const socketId = req.query.socket
    if (socketId) {
      io.to(socketId).emit('productDeleted', `Producto con el id ${pid} fue eliminado del carrito ${cid}`, cart)
    }
  } catch (error) {
    next(error)
  }
})

router.delete("/:cid", async (req, res, next) => {
  try {
    const cart = await cartManager.deleteAllProducts(req.params.cid)
    res.json(cart)
    const io = req.app.get("socketServer")
    const socketId = req.query.socket
    if (socketId) {
      io.to(socketId).emit('productsDeleted', `Carrito vaciado`, cart)
    }
  } catch (error) {
    next(error)
  }
})

export default router
