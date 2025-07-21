import supertest from "supertest";
import { describe, it, expect } from "@jest/globals";
import { createServer } from "../server";

describe("Server", () => {
  it("health check returns 200", async () => {
    const app = await createServer({ skipSchedulers: true });
    await supertest(app)
      .get("/v1/status")
      .expect(200)
      .then((res) => {
        expect(res.ok).toBe(true);
      });
  });

  it("message endpoint says hello", async () => {
    const app = await createServer({ skipSchedulers: true });
    await supertest(app)
      .get("/v1/message/jared")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ message: "hello jared" });
      });
  });
});
