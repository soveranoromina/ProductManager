import { validator } from "../domain/shared/Validator.js"
// import { workWithfile } from "../infraestructure/repositories/WorkWithFiles.js"
import { Factory } from "../domain/factories/Factory.js"
import { MongoDBRepository } from "../infraestructure/repositories/MongoDBRepository.js"
import { CartModel } from "../infraestructure/database/models/CartModel.js"
import { productManager } from "./ProductManager.js"

class CartManager {

    constructor() {
        this.cartRepository = new MongoDBRepository(CartModel)
    }

    getCarts = async (page = 1, limit = 10, filter = {}, sort) => {
        try {
            const filterQuery = {} ? filter = {} : filter.filter
            let sortOrder = {}
            if (sort) { sortOrder.price = sort === "asc" ? 1 : sort === "desc" ? -1 : null }
            const params = {
                page,
                limit,
                sort: sortOrder,
            }
            const carts = await this.cartRepository.getAll(filterQuery, params)
            return carts
        } catch (error) {
            throw new Error(error)
        }
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
        try{
            const cart = await this.cartRepository.create()
            return cart
        } catch (error) {
            throw error
        }
    }

addProductToCart = async (idCart, idProduct) => {
    try {
        const product = await productManager.getProductById(idProduct)
        let cart = await this.getCartById(idCart)

        const products = cart.products? cart.products : []
        const productInCart = products.find(p => String(p.id) === String(idProduct))
        if (productInCart) {
            if (productInCart.quantity >= product.stock) {
                throw new Error("No hay más stock del producto")
            }
            productInCart.quantity += 1
        } else {
            cart.products.push({
                id: idProduct,
                quantity: 1
            })
        }
        cart = await this.cartRepository.update(idCart, cart)
        return cart

    } catch (error) {
        throw error
    }
}
}

export const cartManager = new CartManager()