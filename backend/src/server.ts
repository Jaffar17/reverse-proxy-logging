import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import proxyRouter from "./routes/proxy";
import authRouter from "./routes/auth";
import logsRouter from "./routes/logs";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4545;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error("MONGODB_URI is not defined in .env");
    process.exit(1);
}

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });


// Simple health route to check DB connectivity status
app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "Server is healthy" });
});

app.use("/api/proxy", proxyRouter);

app.use("/api/auth", authRouter);

app.use("/api/logs", logsRouter);