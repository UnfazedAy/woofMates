import mongoose from "mongoose";
import keys from "./keys.js";
import logger from "../helpers/logger.js";

const { MONGO_URI } = keys;

const connectDB = async () => {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const database = mongoose.connection;
    database.on('connected', async () => {
        logger.info('MongoDB connected successfully ...');
    });
    database.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
    });
    database.on('disconnected', () => {
        logger.info('MongoDB disconnected');
    });
}

export default connectDB;
