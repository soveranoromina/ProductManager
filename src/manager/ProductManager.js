import { validator } from "../domain/shared/Validator.js"
import { Factory } from "../domain/factories/Factory.js"
import { MongoDBRepository } from "../infraestructure/repositories/MongoDBRepository.js"
import { ProductModel } from "../infraestructure/database/models/ProductModel.js"

class ProductManager {

    constructor() {
        this.productRepository = new MongoDBRepository(ProductModel)
    }

    getProducts = async (page = 1, limit = 10, filter = {}, sort) => {
        try {
            const filterQuery = {} ? filter = {} : filter.filter
            let sortOrder = {}
            if (sort) { sortOrder.price = sort === "asc" ? 1 : sort === "desc" ? -1 : null }
            const params = {
                page,
                limit,
                sort: sortOrder,
            }
            const products = await this.productRepository.getAll(filterQuery, params)
            return products
        } catch (error) {
            throw error
        }
    }

    getProductById = async (id) => {
        try {
            const product = await this.productRepository.getById(id)
            if (!product) throw new Error("Producto no encontrado")
            return product
        } catch (error) {
            throw error
        }
    }

    addProduct = async (object) => {
        try {
            validator.isEmpty(object)
            const productValidate = Factory.create("product", object, "add")
            const product = await this.productRepository.create(productValidate)
            return product

        } catch (error) {
            throw error
        }
    }


    updateProduct = async (id, object) => {
        try {
            validator.isEmpty(object)
            if ('id' in object) throw new Error("No se puede modificar el campo 'id'")
            const product = await this.getProductById(id)
            let updateProduct = { ...product }
            for (const key of Object.keys(object)) {
                updateProduct[key] = object[key]
            }
            const productValidate = Factory.create("product", updateProduct, "update")
            updateProduct = await this.productRepository.update(id, productValidate)
            return updateProduct
            
        } catch (error) {
            throw error
        }
    }

    deleteProduct = async (id) => {
        try {
            await this.productRepository.delete(id)
            return id
        } catch (error) {
            throw error
        }
    }

}

export const productManager = new ProductManager()
