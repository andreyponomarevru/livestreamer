export const STREAM_AUDIO_CONFIG = { encoding: "mp3", bitrate: "192k" };

export const FFMPEG_ARGS = [
  // hide barnner with irrelevant config
  "-hide_banner",
  // to make output even less verbose, output only errors (https://superuser.com/questions/326629/how-can-i-make-ffmpeg-be-quieter-less-verbose)
  "-loglevel",
  "error",
  "-use_wallclock_as_timestamps",
  "1",
  // capture OS audio output (from pulseaudio)
  "-f",
  "pulse",
  // input device
  "-i",
  "alsa_output.pci-0000_00_1f.3.analog-stereo.monitor",
  // output in .mp3
  "-f",
  "mp3",
  // set bitrate (":a" is "for audio")
  "-b:a",
  "192k",
  // pipe instead of saving to disk
  "pipe:1",
];
