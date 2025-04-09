import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import taskRouter from "./routes/task";
export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    )
    .all("/api/auth/*splat", toNodeHandler(auth))
    .use(json())
    .use("/tasks", taskRouter)
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/api/me", async (req, res) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      return res.json(session);
    });

  return app;
};
