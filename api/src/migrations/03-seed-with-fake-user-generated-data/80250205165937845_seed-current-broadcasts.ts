import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import { faker } from "@faker-js/faker";

import type { Broadcast } from "../../types";

export const shorthands: ColumnDefinitions | undefined = undefined;

function generateCurrentBroadcastDates() {
  const from = new Date();
  from.setHours(from.getMinutes() - 47);
  const to = new Date();
  to.setFullYear(to.getFullYear() + 1);

  const startAt = faker.date.between({ from, to });

  return {
    startAt: startAt.toISOString(),
    endAt: faker.date.future({ refDate: startAt }).toISOString(),
  };
}

const date1 = generateCurrentBroadcastDates();
const date2 = generateCurrentBroadcastDates();

const broadcasts: Omit<Broadcast, "broadcastId" | "likeCount">[] = [
  {
    userId: 2,
    title: "Test Ambient Live Special",
    ...date1,
    listenerPeakCount: 0,
    isVisible: true,
    artworkUrl: "/mnt/01/1.jpg",
    description: "Test description",
  },
  {
    userId: 1,
    title: "Chillout Live Test",
    ...date2,
    listenerPeakCount: 0,
    isVisible: true,
    artworkUrl: "/mnt/01/2.jpg",
    description: "Test description",
  },
];

export async function up(pgm: MigrationBuilder): Promise<void> {
  for (const broadcast of broadcasts) {
    pgm.sql(`
    INSERT INTO broadcast (
      appuser_id,
      title, 
      start_at, 
      end_at, 
      listener_peak_count, 
      is_visible,
      artwork_url,
      description
    )
    VALUES (
      ${broadcast.userId},
      '${broadcast.title}',
      '${broadcast.startAt}',
      '${broadcast.endAt}',
      ${broadcast.listenerPeakCount},
      ${broadcast.isVisible},
      '${broadcast.artworkUrl}',
      '${broadcast.description}'
    )`);
  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE broadcast RESTART IDENTITY CASCADE");
}
