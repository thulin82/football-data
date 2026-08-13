import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getStandings } from "./standings.js";
import { footballService } from "../services/footballService.js";

vi.mock("../services/footballService.js", () => ({
  footballService: { getStandings: vi.fn(), getTeamOverview: vi.fn() },
}));

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

describe("standings controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the index view with the standings", async () => {
    const result = { competition: { name: "Premier League" } };
    vi.mocked(footballService.getStandings).mockResolvedValue(result as never);
    const res = mockRes();

    await getStandings({} as Request, res, vi.fn());

    expect(res.render).toHaveBeenCalledWith("index", { result });
  });

  it("forwards service errors to next", async () => {
    const error = new Error("upstream down");
    vi.mocked(footballService.getStandings).mockRejectedValue(error);
    const next = vi.fn();

    await getStandings({} as Request, mockRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
