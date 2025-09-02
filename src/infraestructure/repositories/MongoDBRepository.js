import { connection } from "../database/MongoDBConnection.js";
import { ProductModel } from "../database/models/ProductModel.js";

class MongoDBManager{
    createProduct = async (product) => {
        try {
            connection.initAtlasMongoDB()
            return await ProductModel.create(product);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export const mongoDBManager = new MongoDBManager()
