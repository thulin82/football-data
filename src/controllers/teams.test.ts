import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getTeam } from "./teams.js";
import { footballService } from "../services/footballService.js";
import { ErrorResponse } from "../utils/errorResponse.js";

vi.mock("../services/footballService.js", () => ({
  footballService: { getStandings: vi.fn(), getTeamOverview: vi.fn() },
}));

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

function mockReq(id: string) {
  return { params: { id } } as unknown as Request<{ id: string }>;
}

describe("teams controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the teams view with team details and fixtures", async () => {
    const team = { id: 57, name: "Arsenal" };
    const fixtures = { count: 0, matches: [] };
    vi.mocked(footballService.getTeamOverview).mockResolvedValue({
      team,
      fixtures,
    } as never);
    const res = mockRes();

    await getTeam(mockReq("57"), res, vi.fn());

    expect(footballService.getTeamOverview).toHaveBeenCalledWith("57");
    expect(res.render).toHaveBeenCalledWith("teams", { result: team, fixtures });
  });

  it("rejects a non numeric team id with a 400", async () => {
    const next = vi.fn();

    await getTeam(mockReq("../competitions"), mockRes(), next);

    expect(footballService.getTeamOverview).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 400 });
  });
});
