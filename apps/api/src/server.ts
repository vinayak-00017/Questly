import { json, urlencoded } from "bo    .use("/api/auth", (req, res, next) => {
      console.log(`[AUTH] ${req.method} ${req.path} - Original URL: ${req.originalUrl}`);
      console.log(`[AUTH] Available Better Auth endpoints:`, Object.keys(auth.api));
      next();
    })
    .use("/api/auth", toNodeHandler(auth))rser";
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
export const createServer = async (
  options: { skipSchedulers?: boolean } = {}
): Promise<Express> => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Headers: ${JSON.stringify(req.headers, null, 2)}`);
      next();
    })
    .use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          process.env.FRONTEND_URL || "http://localhost:3000",
        ].filter(Boolean),
        methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    )
    .use("/api/auth", (req, res, next) => {
      console.log(`[AUTH] ${req.method} ${req.path} - Original URL: ${req.originalUrl}`);
      console.log(`[AUTH] Better Auth API methods:`, Object.keys(auth.api));
      console.log(`[AUTH] Environment: ${process.env.NODE_ENV}`);
      next();
    })
    .use("/api/auth", toNodeHandler(auth))
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
    .get("/health", (_, res) => {
      return res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    })
    .get("/api/me", async (req, res) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      return res.json(session);
    });

  // Only initialize schedulers in production mode or when explicitly requested
  const isTest = process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID;

  if (!options.skipSchedulers && !isTest) {
    await initializeScheduler();
    console.log("Server initialized with scheduled tasks");
    initXpScheduler();
    console.log("Xp awarded to users!");
  } else if (isTest) {
    console.log("Skipping schedulers in test mode");
  }

  return app;
};
