import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minLength: 2,
        maxLength: 255,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    position: {
        type: String,
        required: [true, "Position is required"],
        trim: true,
    },
    region: {
        type: String,
        required: [true, "Region is required"],
        trim: true,
    },
    branch: {
        type: String,
        required: [true, "Branch/Church name is required"],
        trim: true,
    },
    submissionType: {
        type: String,
        required: [true, "Submission type is required"],
        trim: true,
    },
    urgency: {
        type: String,
        enum: ["low", "normal", "high", "critical"],
        default: "normal",
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    files: [{
        fileName: String,
        contentType: String,
        data: Buffer,
        size: Number
    }],
}, { timestamps: true });

export const getSubmissionModel = (submissionType) => {
    if (!submissionType) throw new Error("Submission type is required to get a model");

    const collectionName = submissionType
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

    const modelName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
    
    return mongoose.models[modelName] || mongoose.model(modelName, submissionSchema, collectionName);
};

export default submissionSchema;