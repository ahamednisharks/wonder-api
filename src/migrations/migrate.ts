import { createItemTable } from "../item/table";
import { createUnitTable } from "../unit/table";
// import { createUnitTable } from "../unit/table";
// import { createCategoryTable } from "../category/category.table";
// Add more when needed

async function migrate() {
  console.log("Starting DB migrations...");

  try {
    // Run all migrations in sequence
    await createItemTable();
    await createUnitTable();

    // await createUnitTable();
    // await createCategoryTable();

    console.log(" All migrations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
