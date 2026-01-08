import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";

if (!MONGODB_URI) {
    throw new Error("Please add the MONGODB URI in the env file!");
};

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MONGODB Connected Successfully!");

    } catch (error) {
        console.error("Error connecting to MONGODB database", error)
    }
}

export default connectToDB;