import { db } from "../config/db";

export const UnitModel = {
    
    async create(data: any) {
        const sql = `
            INSERT INTO units (name, short_name)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const res = await db.query(sql, [data.name, data.short_name]);
        return res.rows[0];
    },

    async getAll() {
        const res = await db.query(`SELECT * FROM units ORDER BY name ASC`);
        return res.rows;
    },

    async getById(id: string) {
        const res = await db.query(`SELECT * FROM units WHERE id=$1`, [id]);
        return res.rows[0];
    },

    async update(id: string, data: any) {
        const sql = `
            UPDATE units 
            SET name=$1, short_name=$2
            WHERE id=$3
            RETURNING *;
        `;
        const res = await db.query(sql, [data.name, data.short_name, id]);
        return res.rows[0];
    },

    async remove(id: string) {
        await db.query(`DELETE FROM units WHERE id=$1`, [id]);
        return true;
    }
};
