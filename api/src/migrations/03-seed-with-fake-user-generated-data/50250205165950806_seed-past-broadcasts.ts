import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import { faker } from "@faker-js/faker";

import type { Broadcast } from "../../types";

export const shorthands: ColumnDefinitions | undefined = undefined;

function generatePastBroadcastDates() {
  const from = new Date(2022, 1, 1);
  const to = new Date();
  to.setMonth(to.getMonth() - 3);

  const startAt = faker.date.between({ from, to });

  return {
    startAt: startAt.toISOString(),
    endAt: faker.date.future({ refDate: startAt }).toISOString(),
  };
}

const date1 = generatePastBroadcastDates();
const date2 = generatePastBroadcastDates();
const date3 = generatePastBroadcastDates();
const date4 = generatePastBroadcastDates();
const date5 = generatePastBroadcastDates();
const date6 = generatePastBroadcastDates();

const broadcasts: Broadcast[] = [
  {
    broadcastId: 1,
    userId: 2,
    title: "Ambient Live Special",
    ...date1,
    listenerPeakCount: 23,
    isVisible: true,
    artworkUrl: "/mnt/01/1.jpg",
    description: "Test description",
    likeCount: 65,
  },
  {
    broadcastId: 2,
    userId: 1,
    title: "Chillout Live",
    ...date2,
    listenerPeakCount: 16,
    isVisible: true,
    artworkUrl: "/mnt/01/2.jpg",
    description: "Test description",
    likeCount: 48,
  },
  {
    broadcastId: 3,
    userId: 2,
    title: "Downtempo Live",
    ...date3,
    listenerPeakCount: 7,
    isVisible: true,
    artworkUrl: "/mnt/01/3.jpg",
    description: "Test description",
    likeCount: 34,
  },
  {
    broadcastId: 4,
    userId: 2,
    title: "Jungle/Ambient Live",
    ...date4,
    listenerPeakCount: 12,
    artworkUrl: "/mnt/01/4.jpg",
    description: "Test description",
    isVisible: true,
    likeCount: 67,
  },
  {
    broadcastId: 5,
    userId: 1,
    title: "Test Live",
    ...date5,
    listenerPeakCount: 3,
    artworkUrl: "/mnt/01/5.jpg",
    description: "Test description",
    isVisible: false,
    likeCount: 21,
  },
  {
    broadcastId: 6,
    userId: 2,
    title: "Second Test Live",
    ...date6,
    listenerPeakCount: 8,
    isVisible: false,
    artworkUrl: "/mnt/01/6.jpg",
    description: "Test description",
    likeCount: 59,
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

    pgm.sql(`
    INSERT INTO broadcast_like (
      broadcast_id,
      appuser_id,
      count,
      created_at
    )
    VALUES (
      ${broadcast.broadcastId},
      ${broadcast.userId},
      ${broadcast.likeCount}, 
      '${faker.date
        .between({
          from: new Date(broadcast.startAt),
          to: new Date(broadcast.endAt),
        })
        .toISOString()}')`);
  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE broadcast_like RESTART IDENTITY CASCADE");
  pgm.sql("TRUNCATE TABLE broadcast RESTART IDENTITY CASCADE");
}
