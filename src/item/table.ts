import { db } from "../config/db";

export async function createItemTable() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100) NOT NULL,
        unit VARCHAR(30) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await db.query(sql);
    console.log(" items table created");
  } catch (err) {
    console.error(" Error creating items table:", err);
  }
}
