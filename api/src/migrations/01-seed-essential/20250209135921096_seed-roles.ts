import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import validationTables from "../data/validation-tables.json";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  const roleIds = Object.keys(
    validationTables.roles,
  ) as (keyof typeof validationTables.roles)[];

  const values = roleIds
    .map((id) => {
      const roleName = validationTables.roles[id];
      return `(${id}, '${roleName}')`;
    })
    .join(", ");

  pgm.sql(`INSERT INTO role (role_id, name) VALUES ${values}`);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE role RESTART IDENTITY CASCADE");
}
