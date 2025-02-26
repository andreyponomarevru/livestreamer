import util from "util";

import { v4 as uuidv4 } from "uuid";

import { startStream, buildRequestOptions, signOut } from "./http-client";
import { signIn } from "./http-client";
import { writeStream } from "./utils";
import { audioStream } from "./audio-process";
import { apiConfig, NDOE_ENV } from "./config/api";
const {
  API_HOST,
  API_PORT,
  BROADCASTER_PASSWORD,
  BROADCASTER_USERNAME,
  API_SESSION_URL,
  API_ROOT_PATH,
  API_STREAM_PATH,
} = apiConfig[NDOE_ENV];

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

async function startBroadcast() {
  const options = await buildRequestOptions();
  await startStream(options);

  setInterval(function () {
    const timestamp = new Date().toISOString();
    console.log(`Send audio to server... ${timestamp}`);
  }, 1000);
}

async function startApp(action?: string) {
  switch (action) {
    case "login": {
      await signIn();
      break;
    }

    case "stream": {
      await startBroadcast();
      SAVE_STREAM = args[1] === "save" ? true : false;
      if (SAVE_STREAM) {
        const saveTo = `./recordings/${uuidv4()}.wav`;
        writeStream(audioStream.stdout, saveTo);
      }
      break;
    }

    case "logout": {
      await signOut();
      break;
    }
  }
}

process.on("SIGINT", onCtrlC);
process.on("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

console.log(
  `NODE_ENV:${process.env.NODE_ENV}\nAPI_HOST: ${API_HOST}\nAPI_PORT: ${API_PORT}\nAPI_ROOT_PATH: ${API_ROOT_PATH}\nAPI_STREAM_PATH: ${API_STREAM_PATH}\nAPI_SESSION_URL: ${API_SESSION_URL}\n
BROADCASTER_USERNAME: ${BROADCASTER_USERNAME}\nBROADCASTER_PASSWORD: ${BROADCASTER_PASSWORD}\n`,
);

const args = process.argv.slice(2);
const ACTION = args[0];
let SAVE_STREAM = false;

startApp(ACTION).catch((err) => {
  console.error(err);
  process.exit(0);
});
/*
"start:dev": "nodemon --watch ./src -e ts,json --exec TS_NODE_PROJECT=tsconfig.json node --inspect=0.0.0.0:9229 -r ts-node/register ./src/index.ts",
"login:dev": "API_SESSION_URL=http://localhost:5000/sessions node ./build/index.js login",
"login:prod": "API_SESSION_URL=https://live.andreyponomarev.ru:443/api/v1/sessions node ./build/index.js login",
"logout:dev": "API_SESSION_URL=http://localhost:5000/sessions node ./build/index.js logout",
"logout:prod": "API_SESSION_URL=https://live.andreyponomarev.ru:443/api/v1/sessions node ./build/index.js logout",
"stream:prod": "API_SESSION_URL=https://live.andreyponomarev.ru:443/api/v1/sessions API_HOST=live.andreyponomarev.ru API_PORT=443 API_ROOT_PATH=/api/v1 API_STREAM_PATH=/stream node ./build/index.js stream",
"stream:dev": "API_SESSION_URL=http://localhost:5000/sessions API_HOST=localhost:5000 API_PORT=5000 API_ROOT_PATH=/api/v1 API_STREAM_PATH=/stream node ./build/index.js stream"
*/
