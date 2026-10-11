import express from "express";

import moduleRoutes from "./routes/modules.js";

const app = express();

app.use(express.json()); // lets the server read JSON bodies
app.use("/api/v1/modules", moduleRoutes);

app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

export default app; // exported so Supertest can use it