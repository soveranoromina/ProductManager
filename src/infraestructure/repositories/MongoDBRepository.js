export class MongoDBRepository {
    constructor(model) {
        this.model = model
    }
    create = async (object) => {
        try {
            return await this.model.create(object);
        } catch (error) {
            throw error;
        }
    }
    getAll = async (filter, params) => {
        try {
            return await this.model.paginate(filter, params);
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
    update = async (id, object) =>{
        try {
            return await this.model.findByIdAndUpdate(id, object, {
                new: true,
            });
        } catch (error) {
            throw error
        }
    }
}
