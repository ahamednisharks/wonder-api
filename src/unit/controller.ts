import { Request, Response } from "express";
import { UnitModel } from "./model";
import { validateUnitPayload } from "./validator";

export const UnitController = {

    // -----------------------
    // CREATE UNIT
    // -----------------------
    async create(req: Request, res: Response) {
        const error = validateUnitPayload(req.body);
        if (error) return res.status(400).json({ error });

        try {
            const result = await UnitModel.create(req.body);
            return res.status(201).json(result);
        } catch (err) {
            console.error("Create Unit Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // GET ALL UNITS
    // -----------------------
    async getAll(req: Request, res: Response) {
        try {
            const units = await UnitModel.getAll();
            return res.json(units);
        } catch (err) {
            console.error("Get Units Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // GET UNIT BY ID
    // -----------------------
    async getById(req: Request, res: Response) {
        const id = req.body.id;

        if (!id) {
            return res.status(400).json({ error: "Unit ID is required" });
        }

        try {
            const unit = await UnitModel.getById(id);
            if (!unit) {
                return res.status(404).json({ error: "Unit not found" });
            }
            return res.json(unit);
        } catch (err) {
            console.error("Get Unit Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // UPDATE UNIT
    // -----------------------
    async update(req: Request, res: Response) {
        const id = req.body.id;

        if (!id) return res.status(400).json({ error: "Unit ID required" });

        const error = validateUnitPayload(req.body);
        if (error) return res.status(400).json({ error });

        try {
            const updated = await UnitModel.update(id, req.body);
            return res.json(updated);
        } catch (err) {
            console.error("Update Unit Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // DELETE UNIT
    // -----------------------
    async remove(req: Request, res: Response) {
        const id = req.body.id;

        if (!id) return res.status(400).json({ error: "Unit ID required" });

        try {
            await UnitModel.remove(id);
            return res.json({ message: "Unit deleted" });
        } catch (err) {
            console.error("Delete Unit Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    }

};
