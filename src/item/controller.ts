// src/item/item.controller.ts
import { Request, Response } from "express";
import { ItemModel } from "./model";
import { validateItemPayload } from "./validator";

export const ItemController = {
    // async create(req: Request, res: Response) {
    //     const err = validateItemPayload(req.body);


    //     console.log('add item.......')
    //     if (err) return res.status(400).json({ error: err });
    //     try {
    //         const item = await ItemModel.create(req.body);
    //         return res.status(201).json(item);
    //     } catch (e) {
    //         console.error(e);
    //         return res.status(500).json({ error: "Server error" });
    //     }
    // },


    async create(req: Request, res: Response) {
        console.log("local host item", req.body)
        const err = validateItemPayload(req.body);
        if (err) return res.status(400).json({ error: err });
    
        try {
            const imageName = req.file ? req.file.filename : null;
    
            const item = await ItemModel.create({
                ...req.body,
                image: imageName
            });
    
            return res.status(201).json(item);
    
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Server error" });
        }
    },
    

    async getAll(req: Request, res: Response) {
        try {
            const items = await ItemModel.getAll();
            return res.json(items);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Server error" });
        }
    },

    async getById(req: Request, res: Response) {

        const id = Number(req.body.id);
        if (!id) return res.status(400).json({ error: "Invalid id" });
        try {
            const item = await ItemModel.getById(id);
            if (!item) return res.status(404).json({ error: "Not found" });
            return res.json(item);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Server error" });
        }
    },

    async update(req: Request, res: Response) {
        const id = Number(req.body.id);
        if (!id) return res.status(400).json({ error: "Invalid id" });
        const err = validateItemPayload(req.body);
        if (err) return res.status(400).json({ error: err });

        try {
            const updated = await ItemModel.update(id, req.body);
            return res.json(updated);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Server error" });
        }
    },

    async remove(req: Request, res: Response) {
        const id = Number(req.body.id);
        if (!id) return res.status(400).json({ error: "Invalid id" });
        try {
            await ItemModel.remove(id);
            return res.json({ message: "Deleted" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Server error" });
        }
    }
};
