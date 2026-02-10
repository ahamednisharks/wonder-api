import { Request, Response } from "express";
import { OrdersModel } from "./model";
import { OrdersValidationSchema } from "./validator";

export const OrdersController = {

  async create(req: Request, res: Response) {
    console.log(req.body)
    // 🔥 multipart/form-data → JSON fix
    if (typeof req.body.items === "string") {
      req.body.items = JSON.parse(req.body.items);
    }

    const error = OrdersValidationSchema("create", req.body);
    if (error) return res.status(400).json({ error });

    try {
      const files = req.files as Express.Multer.File[];

      /**
       * IMPORTANT RULE:
       * Frontend must send files in SAME ORDER as items
       */
      if (files?.length) {
        req.body.items.forEach((item: any, index: number) => {
          item.designFile = files[index]
            ? `uploads/items/${files[index].filename}`
            : null;
        });
      }
      console.log("Model file")
      const order = await OrdersModel.createOrder(req.body);

      return res.status(201).json(order);

    } catch (err) {
      console.error("Create Order Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  async getAll(req: Request, res: Response) {
    const orders = await OrdersModel.getAll(req.body);
    return res.json(orders);
  },

  async getById(req: Request, res: Response) {
    const order = await OrdersModel.getById(req.body.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  },

  async remove(req: Request, res: Response) {
    await OrdersModel.remove(req.body.orderId);
    return res.json({ message: "Order deleted" });
  }
};
