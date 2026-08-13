import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./async.js";

describe("asyncHandler", () => {
  it("passes rejections to next", async () => {
    const error = new Error("nope");
    const next = vi.fn() as NextFunction;

    await asyncHandler(async () => {
      throw error;
    })({} as Request, {} as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("does not call next when the handler resolves", async () => {
    const next = vi.fn() as NextFunction;

    await asyncHandler(async () => "ok")({} as Request, {} as Response, next);

    expect(next).not.toHaveBeenCalled();
  });
});
