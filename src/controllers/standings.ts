import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { footballService } from "../services/footballService.js";

// @desc    Premier League standings table
// @route   GET /
// @access  Public
export const getStandings = asyncHandler(async (_req: Request, res: Response) => {
  const result = await footballService.getStandings();

  res.render("index", { result });
});
