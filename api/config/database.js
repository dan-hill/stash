import mongoose from "mongoose";

const MONGO_URI = 'mongodb://localhost:27017/horde';
const MONGO_CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(MONGO_URI, MONGO_CONFIG);

export default mongoose.connection;

