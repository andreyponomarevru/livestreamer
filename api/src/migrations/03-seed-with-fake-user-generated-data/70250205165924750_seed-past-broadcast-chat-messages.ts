import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

import { DEFAULT_USERS } from "../data/default-users";
import chatMessages from "../data/chat-messages.json";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  function getRandomFromArray<T>(arr: Array<T>) {
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
  }

  const broadcastIds = (
    await pgm.db.query(`SELECT broadcast_id FROM broadcast`)
  )?.rows.map(({ broadcast_id }: { broadcast_id: number }) => broadcast_id);

  const superAdminRes = await pgm.db.query(
    `SELECT appuser_id FROM appuser WHERE username = '${DEFAULT_USERS.superadminUser.username}'`,
  );
  const superAdminId = superAdminRes.rows[0].appuser_id;

  const streamerRes = await pgm.db.query(
    `SELECT appuser_id FROM appuser WHERE username = '${DEFAULT_USERS.streamerUser.username}'`,
  );
  const streamerId = streamerRes.rows[0].appuser_id;

  for (const { message } of chatMessages) {
    pgm.sql(
      `INSERT INTO chat_message (
          appuser_id, 
          broadcast_id, 
          message
        )
        VALUES (
          ${getRandomFromArray([superAdminId, streamerId])}, 
          ${getRandomFromArray(broadcastIds)}, 
          '${message}'
        )`,
    );
  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE chat_message RESTART IDENTITY CASCADE");
}
