/** Shapes returned by the football-data.org API, limited to the fields the views use. */

export interface TeamRef {
  id: number;
  name: string;
}

export interface Team extends TeamRef {
  shortName?: string;
  tla?: string;
  crestUrl?: string;
  clubColors?: string;
  venue?: string;
}

export interface TableEntry {
  position: number;
  team: TeamRef;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Standings {
  competition: { id: number; name: string };
  standings: Array<{ type: string; table: TableEntry[] }>;
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  competition: { id: number; name: string };
  homeTeam: TeamRef;
  awayTeam: TeamRef;
}

export interface MatchesResponse {
  count: number;
  matches: Match[];
}
