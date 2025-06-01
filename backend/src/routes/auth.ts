// backend/src/routes/auth.ts

import {Router, Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/user";

const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_here";

// @ts-ignore
authRouter.post("/register", async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "username and password required"});
    }

    try {
        const existing = await User.findOne({username});
        if (existing) {
            return res.status(409).json({message: "User already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, passwordHash});
        return res.status(201).json({id: newUser._id, username: newUser.username});
    } catch (err) {
        console.error("Error in /register:", err);
        return res.status(500).json({message: "Internal error"});
    }
});

// @ts-ignore
authRouter.post("/login", async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "username and password required"});
    }

    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({userId: user._id, username: user.username}, JWT_SECRET, {
            expiresIn: "4h"
        });

        return res.json({token});
    } catch (err) {
        console.error("Error in /login:", err);
        return res.status(500).json({message: "Internal error"});
    }
});

// --- 2.3. A helper to verify token and attach user info ---
export const authRequired = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({message: "Missing or invalid Authorization header"});
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
        (req as any).user = {id: payload.userId, username: payload.username};
        next();
    } catch {
        return res.status(401).json({message: "Invalid or expired token"});
    }
};

export default authRouter;