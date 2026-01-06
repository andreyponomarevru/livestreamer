import http from "http";
import https from "https";
import fs from "fs";

import fsExtra from "fs-extra";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import { spawnStreamProcess } from "./audio-process";
import { writeStreamToDisk } from "./utils";

type Credentials = { username: string; password: string };

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function signIn(url: string, credentials: Credentials): Promise<void> {
  let response: AxiosResponse;

  try {
    response = await client.post(url, credentials, {
      jar,
      withCredentials: true,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  const sessionCookie = response.headers["set-cookie"]![0];
  await fsExtra.writeFile("session-cookie", sessionCookie);

  console.log("Logged in successfully.");
  process.exit(0);
}

async function signOut(url: string): Promise<AxiosResponse<void>> {
  const sessCookie = await fsExtra.readFile("session-cookie");

  try {
    await client.delete(url, {
      jar,
      withCredentials: true,
      headers: { cookie: String(sessCookie) },
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Logged out successfully.");
  process.exit(0);
}

async function schedule(newBroadcast: {
  artwork: string;
  broadcast: {
    title: string;
    startAt: string;
    endAt: string;
    description: string;
  };
}): Promise<void> {
  let response: AxiosResponse;
  const sessCookie = await fsExtra.readFile("session-cookie");

  try {
    const form = new FormData();
    const artworkFilename = "default-broadcast-artwork.jpg";
    const artworkBlob = await fs.openAsBlob(`./${artworkFilename}`);
    form.append("broadcast", JSON.stringify(newBroadcast.broadcast));
    form.append("artwork", artworkBlob, artworkFilename);

    response = await client.post(
      "http://localhost:5000/api/v1/users/me/broadcasts",
      form,
      {
        jar,
        withCredentials: true,
        headers: { cookie: String(sessCookie) },
      },
    );
  } catch (err) {
    console.error((err as AxiosError).response);
    process.exit(1);
  }

  if (response.status === 200) {
    console.log(
      `Scheduled broadcast successfully: ${response.headers["location"]}`,
    );
  }

  process.exit(0);
}

async function onDebugResponseData(chunk: any): Promise<void> {
  console.log(chunk.toString());
}

async function onDebugResponseError(err: Error): Promise<void> {
  console.error(`Response error: ${err}`);
  process.exit(1);
}

async function onDebugRequestError(err: Error): Promise<void> {
  console.error(`Request error: ${err}`);
  process.exit(1);
}

async function startStream(
  requestOptions: http.RequestOptions | https.RequestOptions,
) {
  const request = (
    process.env.NODE_ENV === "production" ? https : http
  ).request(requestOptions);

  function onResponse(res: http.IncomingMessage) {
    console.log(`Response status code: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      process.exit(1);
    }

    res.on("data", onDebugResponseData);
    res.on("error", onDebugResponseError);
  }

  request.on("response", onResponse);
  request.on("error", onDebugRequestError);

  process.on("SIGINT", () => request.end());

  const audioStream = spawnStreamProcess();
  if (!audioStream) throw new Error("Audio stream process has failed to start");
  audioStream.stdout.pipe(request);

  writeStreamToDisk(
    audioStream?.stdout,
    `./recordings/${crypto.randomUUID()}.wav`,
  );

  return request;
}

export { signIn, signOut, startStream, schedule };
