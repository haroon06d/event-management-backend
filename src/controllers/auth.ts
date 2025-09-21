import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const signup = async (req: Request, res: Response) => {
	const { name, email, password, role } = req.body;

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return res.status(400).json({ message: "Email already in use" });

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const user = await prisma.user.create({
			data: { name, email, password: hashedPassword, role: role || "PARTICIPANT" },
		});

		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(400).json({ message: "Invalid email or password" });

		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(400).json({ message: "Invalid email or password" });

		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};
