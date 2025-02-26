import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import validationTables from "./data/validation-tables.json";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  const roles = Object.values(validationTables.roles)
    .map((i) => `('${i}')`)
    .join(", ");

  pgm.sql(`INSERT INTO role (name) VALUES ${roles}`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE role RESTART IDENTITY CASCADE");
}
