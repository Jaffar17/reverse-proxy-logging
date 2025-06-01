import {Router, Request, Response, NextFunction} from "express";
import {createProxyMiddleware, Options} from "http-proxy-middleware";
import {Log} from "../models/log";

const proxyRouter = Router();

// Logging middleware: runs on every request to /api/proxy/*
proxyRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    let logId: string;
    console.log("Proxying request for:", req.originalUrl);
    try {
        const logDoc = await Log.create({
            method: req.method,
            url: req.originalUrl,
            timestamp: new Date()
        });
        // @ts-ignore
        logId = logDoc._id.toString();
        (req as any).logId = logId;
        console.log("Created log", logId);
        console.log("Created log doc before JSON Placeholder API Call", logDoc);
    } catch (err) {
        console.error("Error saving proxy log:", err);
    }

    // Update log with status code
    res.on("finish", async () => {
        if (!logId) return;
        try {
            await Log.findByIdAndUpdate(logId, { statusCode: res.statusCode });
            console.log(`Updated log ${logId} with statusCode ${res.statusCode}`);
        } catch (updateErr) {
            console.error("Failed to update log status:", updateErr);
        }
    });
    next();
});

// Proxy middleware: forward to given JSONPlaceholder API
const proxyOptions = {
    target: "https://jsonplaceholder.typicode.com",
    changeOrigin: true,
    pathRewrite: {
        "^/": "/users/"
    },
    onProxyReq: (proxyReq: any, req: any, res: any) => {
        proxyReq.setHeader("X-Jaffars-Project-Custom-Header", "reverse-proxy-logging")
    },
};

proxyRouter.use("/", createProxyMiddleware(proxyOptions));

export default proxyRouter;