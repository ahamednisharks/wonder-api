import { db } from "../config/db";

export const BillingModel = {

  // ----------------------------------
  // AUTO BILL NUMBER GENERATOR
  // ----------------------------------
  async generateBillNo(client: any) {
    const year = new Date().getFullYear();
    const prefix = `WB-${year}-`;

    const q = `
      SELECT bill_no
      FROM sales_billing
      WHERE bill_no LIKE $1
      ORDER BY bill_no DESC
      LIMIT 1
    `;

    const res = await client.query(q, [`${prefix}%`]);

    let nextNo = 1;

    if (res.rows.length > 0) {
      const lastBillNo = res.rows[0].bill_no; // WB-2026-000012
      const lastNo = parseInt(lastBillNo.split("-")[2], 10);
      nextNo = lastNo + 1;
    }

    return `${prefix}${String(nextNo).padStart(6, "0")}`;
  },

  // ----------------------------------
  // CREATE BILL + ITEMS (TX SAFE)
  // ----------------------------------
  async createBill(data: any) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 🔹 Generate Bill Number HERE
      const billNo = await this.generateBillNo(client);

      // 1️⃣ Insert main bill
      const billQuery = `
        INSERT INTO sales_billing (
          bill_no,
          bill_date,
          subtotal,
          discount,
          total,
          payment_mode,
          amount_paid,
          balance,
          created_by,
          updated_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)
        RETURNING id
      `;

      const billValues = [
        billNo,
        data.billDate || new Date(),
        data.subtotal,
        data.discount || 0,
        data.total,
        data.paymentMode,
        data.amountPaid,
        data.balance,
        data.createdBy
      ];

      const billRes = await client.query(billQuery, billValues);
      const salesBillingId = billRes.rows[0].id;

      // 2️⃣ Insert bill items
      const itemQuery = `
        INSERT INTO sales_billing_items (
          sales_billing_id,
          product_id,
          product_name,
          qty,
          price,
          total
        )
        VALUES ($1,$2,$3,$4,$5,$6)
      `;

      for (const item of data.items) {
        await client.query(itemQuery, [
          salesBillingId,
          item.id,
          item.name,
          item.qty,
          item.price,
          item.total
        ]);
      }

      await client.query("COMMIT");

      return {
        message: "Bill saved successfully",
        billId: salesBillingId,
        billNo
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
  async getAll(filters: any) {

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;
  
    // 🔍 Search (bill no / payment mode)
    if (filters.search) {
      conditions.push(`
        (
          b.bill_no ILIKE $${idx}
          OR b.payment_mode ILIKE $${idx}
        )
      `);
      values.push(`%${filters.search}%`);
      idx++;
    }
  
    // 💳 Payment mode
    if (filters.paymentMode) {
      conditions.push(`b.payment_mode = $${idx}`);
      values.push(filters.paymentMode);
      idx++;
    }
  
    // 📅 From Date
    if (filters.fromDate) {
      conditions.push(`b.bill_date >= $${idx}::date`);
      values.push(filters.fromDate);
      idx++;
    }
  
    // 📅 To Date
    if (filters.toDate) {
      conditions.push(`b.bill_date <= $${idx}::date`);
      values.push(filters.toDate);
      idx++;
    }
  
    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
  
    const q = `
      SELECT
        b.id,
        b.bill_no,
        TO_CHAR(b.bill_date, 'DD-MM-YYYY') AS date,
        b.total,
        b.payment_mode AS payment,
        (
          SELECT COUNT(*)
          FROM sales_billing_items i
          WHERE i.sales_billing_id = b.id
        ) AS items
      FROM sales_billing b
      ${whereClause}
      ORDER BY b.bill_date DESC
    `;
  
    const res = await db.query(q, values);
    return res.rows;
  },
  
  
  

  // ----------------------------------
  // GET BILL BY ID (WITH ITEMS)
  // ----------------------------------
  async getById(id: string) {
    const billRes = await db.query(
      `SELECT * FROM sales_billing WHERE id = $1`,
      [id]
    );

    if (billRes.rows.length === 0) return null;

    const itemsRes = await db.query(
      `
        SELECT
          product_id,
          product_name,
          qty,
          price,
          total
        FROM sales_billing_items
        WHERE sales_billing_id = $1
      `,
      [id]
    );

    return {
      ...billRes.rows[0],
      items: itemsRes.rows
    };
  },

  // ----------------------------------
  // DELETE BILL (CASCADE)
  // ----------------------------------
  async remove(id: string) {
    await db.query(
      `DELETE FROM sales_billing WHERE id = $1`,
      [id]
    );
    return true;
  }
};
