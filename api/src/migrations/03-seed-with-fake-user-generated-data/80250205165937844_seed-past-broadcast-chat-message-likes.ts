import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import { dbConnection } from "../../config/postgres";
import { DEFAULT_USERS } from "../data/default-users";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  const superAdminRes = await pgm.db.query(
    `SELECT appuser_id FROM appuser WHERE username = '${DEFAULT_USERS.superadminUser.username}'`,
  );
  const superAdminId = superAdminRes.rows[0].appuser_id;

  const streamerRes = await pgm.db.query(
    `SELECT appuser_id FROM appuser WHERE username = '${DEFAULT_USERS.streamerUser.username}'`,
  );
  const streamerId = streamerRes.rows[0].appuser_id;

  const msgs = await pgm.db.query(`SELECT chat_message_id FROM chat_message`);

  pgm.sql(`
    INSERT INTO chat_message_like 
      (chat_message_id, appuser_id)
    VALUES 
      (${msgs.rows[0].chat_message_id}, ${streamerId}), 
      (${msgs.rows[48].chat_message_id}, ${streamerId}), 
      (${msgs.rows[56].chat_message_id}, ${streamerId}), 
      (${msgs.rows[0].chat_message_id}, ${superAdminId}), 
      (${msgs.rows[9].chat_message_id}, ${streamerId}), 
      (${msgs.rows[12].chat_message_id}, ${streamerId}), 
      (${msgs.rows[13].chat_message_id}, ${superAdminId}), 
      (${msgs.rows[49].chat_message_id}, ${streamerId}), 
      (${msgs.rows[87].chat_message_id}, ${superAdminId}), 
      (${msgs.rows[87].chat_message_id}, ${streamerId}), 
      (${msgs.rows[86].chat_message_id}, ${streamerId}), 
      (${msgs.rows[85].chat_message_id}, ${streamerId}), 
      (${msgs.rows[84].chat_message_id}, ${streamerId}), 
      (${msgs.rows[83].chat_message_id}, ${superAdminId}), 
      (${msgs.rows[79].chat_message_id}, ${streamerId}), 
      (${msgs.rows[2].chat_message_id}, ${superAdminId})`);

  await dbConnection.close();
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE chat_message_like RESTART IDENTITY CASCADE");
}
