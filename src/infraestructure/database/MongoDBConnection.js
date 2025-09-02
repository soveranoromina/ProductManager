import { connect } from 'mongoose';
import 'dotenv/config'

class CreateConnection {
    initLocalMongoDB = async () => {
        try {
            await connect(process.env.MONGO_LOCAL_URL)
        } catch (error) {
            throw new Error(`Error contecting to MongoDB: ${error}`)
        }
    }

    initAtlasMongoDB = async () => {
        try {
            await connect(process.env.MONGO_ATLAS_URL)
        } catch (error) {
            throw new Error(`Error contecting to MongoDB: ${error}`)
        }
    }
}
export const connection = new CreateConnection()