import { MongoDBRepository } from "../infraestructure/repositories/MongoDBRepository.js"
import { CartModel } from "../infraestructure/database/models/CartModel.js"
import { productManager } from "./ProductManager.js"

class CartManager {

    constructor() {
        this.cartRepository = new MongoDBRepository(CartModel)
    }

    getCartById = async (id) => {
        try {
            const cart = await this.cartRepository.getById(id)
            if (!cart) throw new Error("Carrito no encontrado")
            return cart
        } catch (error) {
            throw error
        }
    }

    getProductsFromCart = async (id) => {
        try {
            const cart = await this.getCartById(id)
            return cart.products
        } catch (error) {
            throw error
        }
    }

    createCart = async () => {
        try {
            const cart = await this.cartRepository.create()
            return cart
        } catch (error) {
            throw error
        }
    }

    addProductToCart = async (cid, pid, quantity = 1) => {
        try {
            const product = await productManager.getProductById(pid)
            const cart = await this.getCartById(cid)
            const productInCart = cart.products.find(p => String(p.id._id) === String(pid))
            if (productInCart) {
                if ((productInCart.quantity += Number(quantity)) >= product.stock) {
                    throw new Error("No hay más stock del producto")
                }
            } else {
                cart.products.push({
                    id: pid,
                    quantity: Number(quantity)
                })
            }
            const updatedCart = await this.cartRepository.update(
                cid,
                { products: cart.products },
                { new: true }
            )
            return updatedCart

        } catch (error) {
            throw error
        }
    }

    updateProductsFromCart = async (cid, products) => {
        try {
            await this.getCartById(cid)
            for (const p of products) {
                await productManager.getProductById(p.id)
            }
            const updatedCart = await this.cartRepository.update(
                cid,
                { products: products },
                { new: true }
            )
            return updatedCart
        } catch (error) {
            throw error
        }
    }


    deleteProductFromCart = async (cid, pid, quantity = 1) => {
        try {
            const cart = await this.getCartById(cid)
            if (cart.products.length === 0) throw new Error(`No hay productos`)
            await productManager.getProductById(pid)
            const productInCart = cart.products.find(p => String(p.id._id) === String(pid))
            console.log(productInCart)
            if (productInCart) {
                if ((productInCart.quantity -= Number(quantity)) <= 0) {
                    cart.products = cart.products.filter(
                        p => String(p.id._id) !== String(pid)
                    )
                }
            } else {
                throw new Error(`No existe el producto ${pid} en el carrito ${cid}`)
            }
            const updatedCart = await this.cartRepository.update(
                cid,
                { products: cart.products },
                { new: true }
            )
            return updatedCart

        } catch (error) {
            throw error
        }
    }

    deleteAllProducts = async (cid) => {
        try {
            const cart = await this.getCartById(cid)
            if (cart.products.length === 0) {
                throw new Error(`No hay productos`)
            } else {
                cart.products = []
            }
            const updatedCart = await this.cartRepository.update(
                cid,
                { products: cart.products },
                { new: true }
            )
            return updatedCart

        } catch (error) {
            throw error
        }
    }
}


export const cartManager = new CartManager()