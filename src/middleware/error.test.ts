import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { errorHandler } from "./error.js";
import { ErrorResponse } from "../utils/errorResponse.js";

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("uses the status code and message of an ErrorResponse", () => {
    const res = mockRes();

    errorHandler(
      new ErrorResponse("Team not found", 404),
      {} as Request,
      res,
      vi.fn() as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.render).toHaveBeenCalledWith("error", {
      statusCode: 404,
      message: "Team not found",
    });
  });

  it("hides internal details for unexpected errors", () => {
    const res = mockRes();

    errorHandler(
      new Error("connection string leaked"),
      {} as Request,
      res,
      vi.fn() as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.render).toHaveBeenCalledWith("error", {
      statusCode: 500,
      message: "Something went wrong",
    });
  });
});
