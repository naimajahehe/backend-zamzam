import logger from "../src/applications/logging";
import mongoose from "mongoose";
import 'dotenv/config';

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`MongoDB Connection error: ${err}`));

mongoose.set("debug", (collectionName, method, query, doc) => {
    logger.info("Mongoose Query Executed", {
        collection: collectionName,
        method,
        query,
        doc,
    });
});

export default mongoose;