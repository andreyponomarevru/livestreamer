import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import validationTables from "../data/validation-tables.json";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  const perms = validationTables.permissions.map((i) => `('${i}')`).join(", ");

  pgm.sql(`INSERT INTO permission (name) VALUES ${perms}`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE permission RESTART IDENTITY CASCADE");
}
