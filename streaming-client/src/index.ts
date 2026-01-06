import util from "util";
import fsExtra from "fs-extra";

import dateFns from "date-fns";

import { startStream, signOut, schedule } from "./http-client";
import { signIn } from "./http-client";
import { apiConfig, NDOE_ENV } from "./config/api";

async function onCtrlC(): Promise<void> {
  console.error("Broadcast is finished.\nConnection has been closed.");
  process.exit(0);
}

async function onUncaughtException(err: Error): Promise<void> {
  console.error(`uncaughtException: ${err.message} \n${err.stack}\n`);
  process.exit(1);
}

async function onUnhandledRejection(
  reason: string,
  p: Promise<Error>,
): Promise<void> {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
  process.exit(1);
}

async function startBroadcast(url: string) {
  console.log(
    `====================\nStart broadcast ${url}\n====================`,
  );

  const sessionCookie = await fsExtra.readFile("session-cookie");
  // await jar.getCookieString(`http://${API_HOST}`);

  await startStream({
    host: apiConfig[NDOE_ENV].API_HOST,
    port: apiConfig[NDOE_ENV].API_PORT,
    // Don't include port number in URL, it will result in error
    path: url,
    method: "PUT",
    headers: {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      cookie: String(sessionCookie),
    },
  });

  function log() {
    const timestamp = new Date().toISOString();
    console.log(`Send audio to server... ${timestamp}`);
  }

  setInterval(log, 1000);
}

async function startApp(action?: string, actionArg?: string) {
  switch (action) {
    case "login": {
      await signIn(`${apiConfig[NDOE_ENV].API_ROOT_PATH}/sessions`, {
        username: apiConfig[NDOE_ENV].BROADCASTER_USERNAME,
        password: apiConfig[NDOE_ENV].BROADCASTER_PASSWORD,
      });
      break;
    }

    case "stream": {
      const broadcastId = actionArg;
      await startBroadcast(
        `${apiConfig[NDOE_ENV].API_ROOT_PATH}/users/me/broadcasts/${broadcastId}/stream`,
      );
      break;
    }

    case "logout": {
      await signOut(`${apiConfig[NDOE_ENV].API_ROOT_PATH}/sessions`);
      break;
    }

    case "schedule": {
      const artwork = "./default-broadcast-artwork.jpg";
      const startAt = new Date();
      const endAt = dateFns.addHours(startAt, 2);
      const newBroadcast = {
        artwork,
        broadcast: {
          title: "My new broadcast",
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          description: "",
        },
      };
      console.log(newBroadcast);
      await schedule(newBroadcast);
      break;
    }

    default:
      throw new Error("Unsupported command-line arg");
  }
}

process.on("SIGINT", onCtrlC);
process.on("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

console.log(
  `NODE_ENV:${process.env.NODE_ENV}
  API_HOST: ${apiConfig[NDOE_ENV].API_HOST}
  API_PORT: ${apiConfig[NDOE_ENV].API_PORT}
  API_ROOT_PATH: ${apiConfig[NDOE_ENV].API_ROOT_PATH}
  BROADCASTER_USERNAME: ${apiConfig[NDOE_ENV].BROADCASTER_USERNAME}
  BROADCASTER_PASSWORD: ${apiConfig[NDOE_ENV].BROADCASTER_PASSWORD}`,
);

const args = process.argv.slice(2);
const ACTION = args[0];
const ACTION_ARG = args[1];

startApp(ACTION, ACTION_ARG).catch((err) => {
  console.error(err);
  process.exit(0);
});
