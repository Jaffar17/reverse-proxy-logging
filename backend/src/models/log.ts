import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
    method: string;
    url: string;
    timestamp: Date;
    statusCode?: number; // optional
}

const LogSchema = new Schema<ILog>({
    method: { type: String, required: true },
    url:    { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    statusCode: { type: Number }
});

export const Log = mongoose.model<ILog>("Log", LogSchema);