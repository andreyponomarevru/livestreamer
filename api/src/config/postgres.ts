import { Pool, type PoolConfig } from "pg";
import { logger } from "../config/logger";
import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from "./env";

//
// Pg connection
//

export const POOL_CONFIG: PoolConfig = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
};

//
// Migrations config (node-pg-migrate)
//

export const PG_MIGRATION_CONFIG = {
  databaseUrl: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  migrationsTable: "pgmigrations_essential",
  dir: "./src/migrations/01-seed-essential",
};

let connectionPool: Pool | undefined;

export const dbConnection = {
  open: async function (config: PoolConfig = POOL_CONFIG): Promise<Pool> {
    if (connectionPool) {
      return connectionPool;
    } else {
      connectionPool = new Pool(config);
      logger.debug("New Postgres connection established");
      return connectionPool;
    }
  },

  // Shutdown cleanly. Doc: https://node-postgres.com/api/pool#poolend
  close: async function (): Promise<void> {
    if (connectionPool) {
      await connectionPool.end();
    }

    connectionPool = undefined;
    logger.debug("Pool has ended");
  },
};
