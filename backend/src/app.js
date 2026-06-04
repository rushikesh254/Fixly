import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/status", (req, res) => {
  res.json({ status: "Server is running" });
});

export { app };
