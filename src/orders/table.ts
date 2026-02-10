import { db } from "../config/db";

export async function createOrdersTables() {
  try {
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- ===============================
      -- MAIN TABLE : orders
      -- ===============================
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        order_no VARCHAR(30) UNIQUE NOT NULL,
        order_date DATE NOT NULL DEFAULT CURRENT_DATE,

        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_alt_phone VARCHAR(20),

        delivery_datetime TIMESTAMP NOT NULL,
        delivery_location_type VARCHAR(10) CHECK (
          delivery_location_type IN ('SHOP','OTHERS')
        ),
        delivery_address TEXT,

        delivery_charge NUMERIC(10,2) DEFAULT 0,

        subtotal NUMERIC(10,2) NOT NULL,
        discount NUMERIC(10,2) DEFAULT 0,
        total NUMERIC(10,2) NOT NULL,

        advance_amount NUMERIC(10,2) DEFAULT 0,
        payment_amount NUMERIC(10,2) DEFAULT 0,

        status VARCHAR(20) DEFAULT 'Pending' CHECK (
          status IN ('Pending','Delivered','Cancelled')
        ),

        bill_generated BOOLEAN DEFAULT FALSE,

        created_by UUID,
        updated_by UUID,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ===============================
      -- SUB TABLE : order_items
      -- ===============================
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        order_id UUID NOT NULL,
        item_id INT NOT NULL,

        item_name VARCHAR(150),
        category VARCHAR(100),
        unit VARCHAR(50),

        qty INT NOT NULL CHECK (qty > 0),
        price NUMERIC(10,2) NOT NULL,
        total NUMERIC(10,2) NOT NULL,

        notes TEXT,
        design_file VARCHAR(255),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_orders
          FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE
      );
    `;

    await db.query(sql);
    console.log("orders & order_items tables created");
  } catch (err) {
    console.error("Error creating orders tables:", err);
  }
}
