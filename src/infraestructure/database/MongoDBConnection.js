import { connect } from 'mongoose';
import 'dotenv/config'

class CreateConnection {
    initMongoDB = async () => {
        try {
            await connect(process.env.MONGO_URL)
        } catch (error) {
            throw new Error(`Error contecting to MongoDB: ${error}`)
        }
    }
}
export const connection = new CreateConnection()