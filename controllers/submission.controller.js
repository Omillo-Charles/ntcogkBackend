import mongoose from "mongoose";
import { getSubmissionModel } from "../models/submission.model.js";

export const createSubmission = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { submissionType } = req.body;

        if (!submissionType) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Submission type is required" });
        }

        const SubmissionModel = getSubmissionModel(submissionType);
        
        const files = req.files ? req.files.map(file => ({
            fileName: file.originalname,
            contentType: file.mimetype,
            data: file.buffer,
            size: file.size
        })) : [];

        const submission = new SubmissionModel({
            ...req.body,
            files
        });

        await submission.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Submission created successfully",
            data: submission
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};