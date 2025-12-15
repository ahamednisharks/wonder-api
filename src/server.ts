// src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { testConnection } from "./config/db";
import path from "path";

console.log("API done");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("Wonder Bakery API running"));

app.use("/api", routes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


const PORT = Number(process.env.PORT || 9000);

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
