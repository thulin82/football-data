import { beforeEach, describe, expect, it, vi } from "vitest";
import { footballService } from "./footballService.js";
import { footballDataClient } from "./footballDataClient.js";

vi.mock("./footballDataClient.js", () => ({
  footballDataClient: { get: vi.fn() },
}));

describe("footballService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getStandings requests the Premier League by default", async () => {
    vi.mocked(footballDataClient.get).mockResolvedValue({ competition: { name: "PL" } });

    const result = await footballService.getStandings();

    expect(footballDataClient.get).toHaveBeenCalledWith("/competitions/PL/standings");
    expect(result).toEqual({ competition: { name: "PL" } });
  });

  it("getStandings accepts another competition code", async () => {
    vi.mocked(footballDataClient.get).mockResolvedValue({});

    await footballService.getStandings("BL1");

    expect(footballDataClient.get).toHaveBeenCalledWith("/competitions/BL1/standings");
  });

  it("getTeamOverview combines team details and scheduled fixtures", async () => {
    const team = { id: 57, name: "Arsenal" };
    const fixtures = { count: 1, matches: [{ id: 1 }] };
    vi.mocked(footballDataClient.get)
      .mockResolvedValueOnce(team)
      .mockResolvedValueOnce(fixtures);

    const result = await footballService.getTeamOverview("57");

    expect(footballDataClient.get).toHaveBeenNthCalledWith(1, "/teams/57");
    expect(footballDataClient.get).toHaveBeenNthCalledWith(
      2,
      "/teams/57/matches?status=SCHEDULED&limit=5"
    );
    expect(result).toEqual({ team, fixtures });
  });

  it("getTeamOverview rejects when one of the requests fails", async () => {
    vi.mocked(footballDataClient.get)
      .mockResolvedValueOnce({ id: 57 })
      .mockRejectedValueOnce(new Error("boom"));

    await expect(footballService.getTeamOverview("57")).rejects.toThrow("boom");
  });
});
