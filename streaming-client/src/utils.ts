import fs from "fs-extra";
import { Readable } from "stream";

export function writeStreamToDisk(readable: Readable, saveTo: string): void {
  const writableStream = fs.createWriteStream(saveTo);
  readable.pipe(writableStream);
}
