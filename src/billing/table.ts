import { db } from "../config/db";

export async function createSalesBillingTables() {
  try {
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- ===============================
      -- MAIN TABLE : sales_billing
      -- ===============================
      CREATE TABLE IF NOT EXISTS sales_billing (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        bill_no VARCHAR(30) UNIQUE NOT NULL,
        bill_date DATE NOT NULL DEFAULT CURRENT_DATE,

        subtotal NUMERIC(10,2) NOT NULL,
        discount NUMERIC(10,2) DEFAULT 0,
        total NUMERIC(10,2) NOT NULL,

        payment_mode VARCHAR(20) NOT NULL CHECK (
          payment_mode IN ('Cash', 'UPI', 'Card')
        ),

        amount_paid NUMERIC(10,2) NOT NULL,
        balance NUMERIC(10,2) NOT NULL,

        created_by UUID,
        updated_by UUID,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ===============================
      -- SUB TABLE : sales_billing_items
      -- ===============================
      CREATE TABLE IF NOT EXISTS sales_billing_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        sales_billing_id UUID NOT NULL,
        product_id INT NOT NULL,

        product_name VARCHAR(150) NOT NULL,
        qty INT NOT NULL CHECK (qty > 0),
        price NUMERIC(10,2) NOT NULL,
        total NUMERIC(10,2) NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_sales_billing
          FOREIGN KEY (sales_billing_id)
          REFERENCES sales_billing(id)
          ON DELETE CASCADE
      );
    `;

    await db.query(sql);
    console.log("sales_billing & sales_billing_items tables created");
  } catch (err) {
    console.error("Error creating sales billing tables:", err);
  }
}
