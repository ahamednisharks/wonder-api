import { db } from "../config/db";

export const AuthModel = {

    async findByCredentials(username: string, password: string) {
        const res = await db.query(
            `SELECT id, name, email FROM users WHERE name=$1 AND password=$2`,
            [username, password]
        );
        return res.rows[0];
    },

    async createUser(data: any) {
        const res = await db.query(
            `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3) RETURNING id, name, email`,
            [data.name, data.email, data.password]
        );
        return res.rows[0];
    }

};
