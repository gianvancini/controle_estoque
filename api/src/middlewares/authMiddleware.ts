import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).send("Usuário/Senha inválidos.");
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).send("Token inválido ou expirado.");
        }

        req.body.userId = decoded.id;
        next();
    });
};
