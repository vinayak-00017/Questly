import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import questRouter from "./routes/quest";
import mainQuestRouter from "./routes/main-quest";
import instanceRouter from "./routes/instance";
import userRouter from "./routes/user";
import { initializeScheduler } from "../services/quest-scheduler";
import { initXpScheduler } from "../services/xp-scheduler";
export const createServer = async (): Promise<Express> => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    )
    .all("/api/auth/*splat", toNodeHandler(auth))
    .use(json())
    .use("/quest", questRouter)
    .use("/instance", instanceRouter)
    .use("/main-quest", mainQuestRouter)
    .use("/user", userRouter)
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
  await initializeScheduler();
  console.log("Server initialized with scheduled tasks");
  initXpScheduler();
  console.log("Xp awarded to users!");

  return app;
};
