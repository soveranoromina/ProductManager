export class MongoDBRepository {
    constructor(model){
        this.model = model
    }
    create = async (product) => {
        try {
            return await this.model.create(product);
        } catch (error) {
            throw error;
        }
    }
    getAll = async () => {
        try {
            return await this.model.find({});
        } catch (error) {
            throw error;
        }
    }
    getById = async (id) => {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw error;
        }
    }
    delete = async (id) => {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}
