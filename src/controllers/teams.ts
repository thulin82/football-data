import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { footballService } from "../services/footballService.js";
import { ErrorResponse } from "../utils/errorResponse.js";

// @desc    Team details with upcoming fixtures
// @route   GET /team/:id
// @access  Public
export const getTeam = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      throw new ErrorResponse("Team id must be numeric", 400);
    }

    const { team, fixtures } = await footballService.getTeamOverview(id);

    res.render("teams", { result: team, fixtures });
  }
);
