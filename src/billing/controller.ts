import { Request, Response } from "express";
import { BillingModel } from "./model";
import { BillingValidationSchema } from "./validator";

export const BillingController = {

    // -----------------------
    // CREATE / SAVE BILL
    // -----------------------
    async create(req: Request, res: Response) {
        console.log("Save Bill = ", req.body)
        const error = BillingValidationSchema('create', req.body);
        if (error) return res.status(400).json({ error });

        try {
            const bill = await BillingModel.createBill(req.body);
            return res.status(201).json(bill);
        } catch (err) {
            console.error("Create Bill Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // GET ALL BILLS
    // -----------------------
    async getAll(req: Request, res: Response) {
        try {
            const bills = await BillingModel.getAll(req.body);
            return res.json(bills);
        } catch (err) {
            console.error("Get Bills Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // GET BILL BY ID
    // -----------------------
    async getById(req: Request, res: Response) {
        const id = req.body.id;

        if (!id) {
            return res.status(400).json({ error: "Bill ID is required" });
        }

        try {
            const bill = await BillingModel.getById(id);
            if (!bill) {
                return res.status(404).json({ error: "Bill not found" });
            }
            return res.json(bill);
        } catch (err) {
            console.error("Get Bill Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // -----------------------
    // DELETE BILL
    // -----------------------
    async remove(req: Request, res: Response) {
        const id = req.body.id;

        if (!id) {
            return res.status(400).json({ error: "Bill ID required" });
        }

        try {
            await BillingModel.remove(id);
            return res.json({ message: "Bill deleted" });
        } catch (err) {
            console.error("Delete Bill Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    }

};
