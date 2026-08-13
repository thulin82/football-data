import { afterEach, describe, expect, it } from "vitest";
import { loadEnv, getEnv, resetEnvCache } from "./env.js";

afterEach(() => {
  resetEnvCache();
});

describe("loadEnv", () => {
  it("applies defaults when only the required values are set", () => {
    const env = loadEnv({ API_KEY: "secret" } as NodeJS.ProcessEnv);

    expect(env).toEqual({
      NODE_ENV: "development",
      PORT: 4567,
      API_KEY: "secret",
      FOOTBALL_API_BASE_URL: "https://api.football-data.org/v2",
    });
  });

  it("coerces PORT to a number", () => {
    const env = loadEnv({ API_KEY: "secret", PORT: "8080" } as NodeJS.ProcessEnv);

    expect(env.PORT).toBe(8080);
  });

  it("throws when API_KEY is missing", () => {
    expect(() => loadEnv({} as NodeJS.ProcessEnv)).toThrow(
      /Invalid environment configuration/
    );
  });

  it("throws when NODE_ENV is not a known value", () => {
    expect(() =>
      loadEnv({ API_KEY: "secret", NODE_ENV: "staging" } as NodeJS.ProcessEnv)
    ).toThrow(/Invalid environment configuration/);
  });

  it("throws when the API base url is not a url", () => {
    expect(() =>
      loadEnv({ API_KEY: "secret", FOOTBALL_API_BASE_URL: "nope" } as NodeJS.ProcessEnv)
    ).toThrow(/Invalid environment configuration/);
  });
});

describe("getEnv", () => {
  it("returns the most recently loaded env without re-reading process.env", () => {
    loadEnv({ API_KEY: "cached-key" } as NodeJS.ProcessEnv);

    expect(getEnv().API_KEY).toBe("cached-key");
  });
});
