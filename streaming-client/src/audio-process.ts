import { spawn, type ChildProcessWithoutNullStreams } from "child_process";

import { FFMPEG_ARGS } from "./config/audio";

let child: ChildProcessWithoutNullStreams | undefined;

export function spawnStreamProcess() {
  if (!child) {
    child = spawn("ffmpeg", FFMPEG_ARGS);
    // Without piping to process.stderr, ffmpeg silently hangs
    // after a few minutes

    child.stderr.pipe(process.stderr);
  }

  return child;
}
