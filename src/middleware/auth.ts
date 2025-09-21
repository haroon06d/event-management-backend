import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as JwtVerifyPayload } from "jsonwebtoken";

interface JwtPayload {
	userId: number;
	role: "ADMIN" | "PARTICIPANT";
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: "Missing token" });

	const token = authHeader.split(" ")[1];
	if (!token) return res.status(401).json({ message: "Missing token" });

	const secret = process.env.JWT_SECRET;
	if (!secret) return res.status(500).json({ message: "JWT secret not set" });

	try {
		const decoded = jwt.verify(token, secret) as JwtVerifyPayload;

		if (typeof decoded === "object" && "userId" in decoded && "role" in decoded) {
			req.user = { userId: Number(decoded.userId), role: decoded.role as "ADMIN" | "PARTICIPANT" };
			next();
		} else {
			return res.status(401).json({ message: "Invalid token payload" });
		}
	} catch (err) {
		console.error(err);
		res.status(401).json({ message: "Invalid token" });
	}
};

export const authorize = (role: "ADMIN" | "PARTICIPANT") => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return res.status(401).json({ message: "Unauthorized" });
		if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
		next();
	};
};
