import { Router, Request, Response } from "express";
import { Log } from "../models/log";
import { authRequired } from "./auth";

const logsRouter = Router();

// @ts-ignore
logsRouter.get("/", authRequired, async (req: Request, res: Response) => {
    try {
        const { start, end, page = "1", limit = "50" } = req.query;

        const pageNum = Math.max(parseInt(page as string, 10), 1);
        const limitNum = Math.max(parseInt(limit as string, 10), 1);


        let startDate: Date, endDate: Date;
        if (start) {
            startDate = new Date(start as string);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ message: "Invalid `start` timestamp" });
            }
        } else {
            startDate = new Date(Date.now() - 1000 * 60 * 60 * 3); // 3 hours ago
        }

        if (end) {
            endDate = new Date(end as string);
            if (isNaN(endDate.getTime())) {
                return res.status(400).json({ message: "Invalid `end` timestamp" });
            }
        } else {
            endDate = new Date(); // now
        }

        const dateFilter = { timestamp: { $gte: startDate, $lte: endDate } };

        const totalCount = await Log.countDocuments(dateFilter);

        const logs = await Log.find(dateFilter)
            .sort({ timestamp: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        return res.json({
            page: pageNum,
            limit: limitNum,
            total: totalCount,
            pages: Math.ceil(totalCount / limitNum),
            data: logs
        });
    } catch (err) {
        console.error("Error in GET /api/logs:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default logsRouter;