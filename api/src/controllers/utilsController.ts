import { Request, Response } from "express";

export const healthcheck = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({message: "It's alive!!!"});
  } catch (error) {
    res.status(500).json({ message: "humm..., something went horribly wrong" });
  }
};