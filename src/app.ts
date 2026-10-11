import express from "express";

const app = express();
app.use(express.json()); // lets the server read JSON bodies

app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

export default app; // exported so Supertest can use it