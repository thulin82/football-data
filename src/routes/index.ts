import { Router } from "express";
import { getStandings } from "../controllers/standings.js";
import { getTeam } from "../controllers/teams.js";

const router = Router();

router.get("/", getStandings);

router.get("/team/:id", getTeam);

export default router;
