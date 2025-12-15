// src/config/db.ts
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT || 5432),
});

db.on('error', (err:any) => {
  console.error('Unexpected DB error', err);
});

export async function testConnection() {
  try {
    await db.query('SELECT 1');
    console.log('Postgres connected');
  } catch (err) {
    console.error('Postgres connect error', err);
    throw err;
  }
}
