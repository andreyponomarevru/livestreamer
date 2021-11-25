import http, { ClientRequest, RequestOptions } from "http";

import fs from "fs-extra";
import axios, { AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import { audioStream } from "./audio-process";
import {
  API_HOST,
  API_PORT,
  BROADCASTER_PASSWORD,
  BROADCASTER_USERNAME,
  API_SESSION_URL,
  API_ROOT_PATH,
  API_STREAM_PATH,
} from "./config/api";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function buildRequestOptions(): Promise<RequestOptions> {
  const sessionCookie = await (await fs.readFile("session-cookie")).toString();
  // await jar.getCookieString(`http://${API_HOST}`);

  const options: RequestOptions = {
    host: API_HOST,
    port: API_PORT,
    path: `${API_ROOT_PATH}${API_STREAM_PATH}`,
    method: "PUT",
    headers: {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      // Don't include port number in URL, it will result in error
      cookie: sessionCookie,
    },
  };
  return options;
}

async function signIn(): Promise<AxiosResponse<unknown>> {
  const response = await client.post(
    API_SESSION_URL,
    { username: BROADCASTER_USERNAME, password: BROADCASTER_PASSWORD },
    { jar, withCredentials: true },
  );
  const sessionCookie = response.headers["set-cookie"][0];
  await fs.writeFile("session-cookie", sessionCookie);
  console.log("Logged In Successfully.");
  process.exit(0);
}

async function signOut(): Promise<AxiosResponse<unknown>> {
  await client.delete(API_SESSION_URL, {
    jar,
    withCredentials: true,
    headers: { cookie: await fs.readFile("session-cookie") },
  });
  console.log("Logged Out Successfully.");
  process.exit(0);
}

// This functions is for debugging purposes only
async function onResponseData(chunk: any): Promise<void> {
  console.log(chunk.toString());
}

async function onResponseError(err: Error): Promise<void> {
  console.error(`Response error: ${err}`);
  process.exit(1);
}

async function onRequestError(err: Error): Promise<void> {
  console.error(`Request error: ${err}`);
  process.exit(1);
}

function startStream(requestOptions: RequestOptions): ClientRequest {
  const request = http.request(requestOptions);

  request.on("response", (res) => {
    console.log(`Response status code: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      process.exit(1);
    }

    res.on("data", onResponseData);
    res.on("error", onResponseError);
  });
  request.on("error", onRequestError);

  process.on("SIGINT", () => request.end());

  // Pass audio stream into request stream
  audioStream.stdout.pipe(request);

  return request;
}

export { signIn, signOut, startStream, buildRequestOptions };
