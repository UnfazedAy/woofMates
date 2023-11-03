import mongoose from "mongoose";
import keys from "./keys.js";
import logger from "../helpers/logger.js";
import colors from "colors";

const { MONGO_URI } = keys;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const database = conn.connection.db.databaseName;
        logger.info(`MongoDB connected: ${database}`.cyan.underline.bold);

    } catch (error) {
        logger.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
}

export default connectDB;