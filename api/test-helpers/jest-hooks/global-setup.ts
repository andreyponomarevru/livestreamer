import migrateDB from "node-pg-migrate";
import { dbConnection, PG_MIGRATION_CONFIG } from "../../src/config/postgres";

// Execute migrations once before all tests
async function globalSetup() {
  console.log("[ Jest globalSetup Hook ]: Execute DB Migrations");

  await migrateDB({
    ...PG_MIGRATION_CONFIG,
    checkOrder: true,
    direction: "up",
  });

  await dbConnection.close();
}

export default globalSetup;
