import { footballDataClient } from "./footballDataClient.js";
import type { MatchesResponse, Standings, Team } from "../models/football.js";

const UPCOMING_FIXTURES_LIMIT = 5;

/**
 * Business logic for football data, decoupled from Express so it can be unit
 * tested independently of req/res.
 */
export const footballService = {
  getStandings(competition = "PL"): Promise<Standings> {
    return footballDataClient.get<Standings>(`/competitions/${competition}/standings`);
  },

  /** Team details and upcoming fixtures are fetched in parallel. */
  async getTeamOverview(
    teamId: string
  ): Promise<{ team: Team; fixtures: MatchesResponse }> {
    const [team, fixtures] = await Promise.all([
      footballDataClient.get<Team>(`/teams/${teamId}`),
      footballDataClient.get<MatchesResponse>(
        `/teams/${teamId}/matches?status=SCHEDULED&limit=${UPCOMING_FIXTURES_LIMIT}`
      ),
    ]);

    return { team, fixtures };
  },
};
