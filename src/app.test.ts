import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { footballService } from "./services/footballService.js";

vi.mock("./services/footballService.js", () => ({
  footballService: { getStandings: vi.fn(), getTeamOverview: vi.fn() },
}));

const app = createApp();

describe("app routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("GET /healthz reports ok", async () => {
    const res = await request(app).get("/healthz");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET / renders the standings table", async () => {
    vi.mocked(footballService.getStandings).mockResolvedValue({
      competition: { id: 2021, name: "Premier League" },
      standings: [
        {
          type: "TOTAL",
          table: [
            {
              position: 1,
              team: { id: 57, name: "Arsenal" },
              playedGames: 10,
              won: 8,
              draw: 1,
              lost: 1,
              goalsFor: 20,
              goalsAgainst: 5,
              goalDifference: 15,
              points: 25,
            },
          ],
        },
      ],
    });

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Premier League");
    expect(res.text).toContain("Arsenal");
    expect(res.text).toContain("/team/57");
  });

  it("GET /team/:id renders team details and fixtures", async () => {
    vi.mocked(footballService.getTeamOverview).mockResolvedValue({
      team: { id: 57, name: "Arsenal FC", tla: "ARS", venue: "Emirates Stadium" },
      fixtures: {
        count: 1,
        matches: [
          {
            id: 1,
            utcDate: "2026-09-01T12:00:00Z",
            status: "SCHEDULED",
            competition: { id: 2021, name: "Premier League" },
            homeTeam: { id: 57, name: "Arsenal FC" },
            awayTeam: { id: 61, name: "Chelsea FC" },
          },
        ],
      },
    });

    const res = await request(app).get("/team/57");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Emirates Stadium");
    expect(res.text).toContain("Chelsea FC");
  });

  it("GET /team/:id renders the error page for an invalid id", async () => {
    const res = await request(app).get("/team/abc");

    expect(res.status).toBe(400);
    expect(res.text).toContain("Team id must be numeric");
  });

  it("renders the error page when the service fails", async () => {
    vi.mocked(footballService.getStandings).mockRejectedValue(new Error("upstream"));

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.text).toContain("Something went wrong");
  });
});
