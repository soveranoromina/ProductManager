import { validator } from "../domain/shared/Validator.js"
import { workWithfile } from "../infraestructure/repositories/WorkWithFiles.js"
import { Factory } from "../domain/factories/Factory.js"
import { MongoDBRepository } from "../infraestructure/repositories/MongoDBRepository.js"
import { ProductModel } from "../infraestructure/database/models/ProductModel.js"

class ProductManager {
    
  constructor() {
    this.productRepository = new MongoDBRepository(ProductModel);
  }

    getProducts = async () => {
        const products = await this.productRepository.getAll()
        if (products.length === 0) throw new Error("No existen productos")
        return products
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
            const newProduct = { ...productValidate }

            const product = await this.productRepository.create(newProduct)
            return product

        } catch (error) {
            throw error
        }
    }


    updateProduct = async (id, object) => {
        try {

            validator.isEmpty(object)
            if ('id' in object) throw new Error("No se puede modificar el campo 'id'")

            const products = await this.getProducts()
            await this.getProductById(id)

            const i = products.findIndex(p => p.id === Number(id))
            const product = { ...products[i], ...object }

            Factory.create("product", id, product, "update")
            products[i] = product

            await workWithfile.writeFile(this.path, JSON.stringify(products, null, 2))

            return product

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

export const productManager = new ProductManager('./src/infraestructure/data/products.json')
