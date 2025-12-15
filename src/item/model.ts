// src/item/item.model.ts
import { db } from "../config/db";

export const ItemModel = {
    async create(data: any) {
        const q = `INSERT INTO items (name, category, unit, price, description, active)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const vals = [data.name, data.category, data.unit, data.price, data.description || null, data.active ?? true];
        const res = await db.query(q, vals);
        return res.rows[0];
    },

    async getAll() {
        const q = `SELECT id, name, category, unit, price, description, active, created_at
               FROM items ORDER BY id DESC`;
        const res = await db.query(q);
        return res.rows;
    },

    async getById(id: number) {
        const q = `SELECT * FROM items WHERE id=$1`;
        const res = await db.query(q, [id]);
        return res.rows[0];
    },

    async update(id: number, data: any) {
        const q = `UPDATE items SET name=$1, category=$2, unit=$3, price=$4, description=$5, active=$6
               WHERE id=$7 RETURNING *`;
        const vals = [data.name, data.category, data.unit, data.price, data.description || null, data.active ?? true, id];
        const res = await db.query(q, vals);
        return res.rows[0];
    },

    async remove(id: number) {
        await db.query(`DELETE FROM items WHERE id=$1`, [id]);
        return true;
    }
};
