import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import validationTables from "../data/validation-tables.json";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  const resources = validationTables.resources
    .map((i) => `('${i}')`)
    .join(", ");

  await pgm.sql(`INSERT INTO resource (name) VALUES ${resources}`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE resource RESTART IDENTITY CASCADE");
}
