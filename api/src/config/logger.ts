import winston from "winston";
import {
  APP_NAME,
  LOG_LOCATION,
  DEBUG_LOG_NAME,
  SHOULD_LOG_TO_FILE,
} from "./../config/env";

//
// Winston logger
//

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `${level} [${timestamp}] ${String(label).toUpperCase()}: ${message}`;
  },
);

function createTransports(shouldLogToFile = false) {
  return shouldLogToFile
    ? new winston.transports.File({
        level: "debug",
        filename: `${LOG_LOCATION}/${DEBUG_LOG_NAME}`,
        format: winston.format.combine(
          winston.format.label({ label: APP_NAME }),
          winston.format.timestamp(),
          winston.format.colorize({ all: true }),
          logFormat,
        ),
      })
    : new winston.transports.Console({
        // Affect all logs with level 'debug' and below
        level: "debug",
        format: winston.format.combine(
          winston.format.label({ label: APP_NAME }),
          winston.format.timestamp(),
          winston.format.colorize({ all: true }),
          logFormat,
        ),
      });
}

const logger = winston.createLogger({
  transports: createTransports(SHOULD_LOG_TO_FILE),
  exitOnError: false,
});

const stream = {
  write: (message: string): void => {
    // use the 'info' log level. The output will be picked up by both 'file' and 'console' transports
    logger.info(message);
  },
  silent: false,
};

//
// Morgan logger
//

// Redirect Morgan logging to Winston log files
const morganSettings = { immediate: true, stream };

export { logger, morganSettings };
