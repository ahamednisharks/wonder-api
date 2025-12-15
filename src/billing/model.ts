import { db } from "../config/db";

export const BillingModel = {

  // ----------------------------------
  // CREATE BILL + BILL ITEMS (TX SAFE)
  // ----------------------------------
  async createBill(data: any) {

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1️⃣ INSERT BILL (MASTER)
      const billQuery = `
        INSERT INTO billing (
          subtotal,
          discount,
          total,
          payment_mode,
          amount_paid,
          balance
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id
      `;

      const billValues = [
        data.subtotal,
        data.discount || 0,
        data.total,
        data.paymentMode,
        data.amountPaid,
        data.balance
      ];

      const billResult = await client.query(billQuery, billValues);
      const billId = billResult.rows[0].id;

      // 2️⃣ INSERT BILL ITEMS
      const itemQuery = `
        INSERT INTO billing_items (
          bill_id,
          item_id,
          item_name,
          qty,
          price,
          total
        )
        VALUES ($1,$2,$3,$4,$5,$6)
      `;

      for (const item of data.items) {
        const itemValues = [
          billId,
          item.id,
          item.name,
          item.qty,
          item.price,
          item.total
        ];

        await client.query(itemQuery, itemValues);
      }

      await client.query("COMMIT");

      return {
        message: "Bill saved successfully",
        billId
      };

    } catch (err) {
      await client.query("ROLLBACK");
      console.error("BillingModel.createBill error:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  // ----------------------------------
  // GET ALL BILLS
  // ----------------------------------
  async getAll() {
    const q = `
      SELECT 
        b.id,
        b.subtotal,
        b.discount,
        b.total,
        b.payment_mode,
        b.amount_paid,
        b.balance,
        b.created_at
      FROM billing b
      ORDER BY b.id DESC
    `;
    const res = await db.query(q);
    return res.rows;
  },

  // ----------------------------------
  // GET BILL BY ID (WITH ITEMS)
  // ----------------------------------
  async getById(id: number) {

    const billQuery = `
      SELECT * FROM billing WHERE id = $1
    `;
    const billRes = await db.query(billQuery, [id]);

    if (billRes.rows.length === 0) return null;

    const itemsQuery = `
      SELECT 
        item_id,
        item_name,
        qty,
        price,
        total
      FROM billing_items
      WHERE bill_id = $1
    `;
    const itemsRes = await db.query(itemsQuery, [id]);

    return {
      ...billRes.rows[0],
      items: itemsRes.rows
    };
  },

  // ----------------------------------
  // DELETE BILL (CASCADE SAFE)
  // ----------------------------------
  async remove(id: number) {

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `DELETE FROM billing_items WHERE bill_id = $1`,
        [id]
      );

      await client.query(
        `DELETE FROM billing WHERE id = $1`,
        [id]
      );

      await client.query("COMMIT");

      return true;

    } catch (err) {
      await client.query("ROLLBACK");
      console.error("BillingModel.remove error:", err);
      throw err;
    } finally {
      client.release();
    }
  }

};
