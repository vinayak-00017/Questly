import { createServer } from "./server";

async function startServer() {
  const port = process.env.PORT || 5001;
  try {
    const app = await createServer();
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
