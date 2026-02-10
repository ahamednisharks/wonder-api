import { db } from "../config/db";

export const OrdersModel = {

    // -------------------------------
    // AUTO ORDER NUMBER
    // -------------------------------
    async generateOrderNo(client: any) {
        const year = new Date().getFullYear();
        const prefix = `WB-${year}-`;

        const q = `
      SELECT order_no
      FROM orders
      WHERE order_no LIKE $1
      ORDER BY order_no DESC
      LIMIT 1
    `;

        const res = await client.query(q, [`${prefix}%`]);

        let nextNo = 1;
        if (res.rows.length) {
            nextNo = parseInt(res.rows[0].order_no.split("-")[2]) + 1;
        }

        return `${prefix}${String(nextNo).padStart(6, "0")}`;
    },

    // -------------------------------
    // CREATE ORDER + ITEMS
    // -------------------------------
    async createOrder(data: any) {
        const client = await db.connect();

        try {
            await client.query("BEGIN");

            const orderNo = await this.generateOrderNo(client);

            //   const subtotal = data.items.reduce(
            //     (s: number, i: any) => s + i.total, 0
            //   );

            const subtotal = data.items.reduce(
                (sum: number, i: any) => sum + (i.quantity * Number(i.price)),
                0
            );

            const total =
                subtotal +
                (data.deliveryCharge || 0) -
                (data.discount || 0);

            const orderQuery = `
        INSERT INTO orders (
          order_no,
          customer_name,
          customer_phone,
          customer_alt_phone,
          delivery_datetime,
          delivery_location_type,
          delivery_address,
          delivery_charge,
          subtotal,
          discount,
          total,
          advance_amount,
          payment_amount,
          created_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING id
      `;

            const orderRes = await client.query(orderQuery, [
                orderNo,
                data.customerName,
                data.customerPhone,
                data.customerAltPhone,
                data.deliveryDateTime,
                data.deliveryLocationType,
                data.deliveryAddress,
                data.deliveryCharge || 0,
                subtotal,
                data.discount || 0,
                total,
                data.advanceAmount || 0,
                data.paymentAmount || 0,
                data.createdBy
            ]);

            const orderId = orderRes.rows[0].id;

            const itemQuery = `
        INSERT INTO order_items (
          order_id,
          item_id,
          item_name,
          category,
          unit,
          qty,
          price,
          total,
          notes,
          design_file
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `;

            for (const item of data.items) {
                await client.query(itemQuery, [
                    orderId,
                    item.itemId,
                    item.itemName,
                    item.category,
                    item.unit,
                    item.quantity,
                    item.price,
                    //   item.total,
                    item.quantity * item.price, // 🔥 total calculated here

                    item.notes,
                    item.designFile // ✅ multer path
                ]);
            }

            await client.query("COMMIT");

            return {
                sucess: true,
                message: "Order created successfully",
                orderId,
                orderNo
            };

        } catch (err) {
            await client.query("ROLLBACK");
            console.error("OrdersModel.createOrder:", err);
            throw err;
        } finally {
            client.release();
        }
    },

    // -------------------------------
    // LIST ORDERS
    // -------------------------------
    async getAll(filters: any) {

        const conditions: string[] = [];
        const values: any[] = [];
        let idx = 1;

        // 🔍 Search
        if (filters.search) {
            conditions.push(`
            (
              o.order_no ILIKE $${idx}
              OR o.customer_name ILIKE $${idx}
            )
          `);
            values.push(`%${filters.search}%`);
            idx++;
        }

        // 📌 Status
        if (filters.status) {
            conditions.push(`o.status = $${idx}`);
            values.push(filters.status);
            idx++;
        }

        // 📅 From Date
        if (filters.fromDate) {
            conditions.push(`o.order_date >= $${idx}::date`);
            values.push(filters.fromDate);
            idx++;
        }

        // 📅 To Date
        if (filters.toDate) {
            conditions.push(`o.order_date <= $${idx}::date`);
            values.push(filters.toDate);
            idx++;
        }

        const where = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const q = `
          SELECT
            o.id                                AS "id",
      
            o.order_no                         AS "orderNo",
            TO_CHAR(o.order_date, 'YYYY-MM-DD') AS "orderDate",
      
            o.customer_name                    AS "customerName",
            o.customer_phone                   AS "customerPhone",
      
            o.advance_amount                   AS "advanceAmount",
            o.payment_amount                   AS "paymentAmount",
      
            o.delivery_datetime                AS "deliveryDateTime",
      
            CASE
              WHEN o.delivery_location_type = 'SHOP' THEN 'Shop'
              ELSE 'Others'
            END                                AS "deliveryLocation",
      
            o.status                           AS "status",
            o.bill_generated                   AS "billGenerated"
      
          FROM orders o
          ${where}
          ORDER BY o.created_at DESC
        `;

        const res = await db.query(q, values);
        return res.rows;
    },

    // -------------------------------
    // GET ORDER BY ID
    // -------------------------------
    async getById(id: string) {
        const orderRes = await db.query(
            `SELECT * FROM orders WHERE id = $1`,
            [id]
        );

        if (!orderRes.rows.length) return null;

        const itemsRes = await db.query(
            `SELECT * FROM order_items WHERE order_id = $1`,
            [id]
        );

        return {
            ...orderRes.rows[0],
            items: itemsRes.rows
        };
    },

    // -------------------------------
    // DELETE ORDER
    // -------------------------------
    async remove(id: string) {
        await db.query(`DELETE FROM orders WHERE id = $1`, [id]);
        return true;
    }
};
