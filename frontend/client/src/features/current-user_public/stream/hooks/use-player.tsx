import * as React from "react";

type Player = { isPlaying: boolean; togglePlay: () => void };

export function usePlayer(url: string): Player {
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  React.useEffect(() => {
    if (audio && isPlaying) audio.play();
  }, [audio]);

  React.useEffect(() => {
    if (isPlaying) {
      if (audio === null) {
        setAudio(new Audio(url));
      }
      const audioPromise = audio?.play();
      if (audioPromise !== undefined) {
        audioPromise.catch((err) => console.error(err));
      }
    } else {
      audio?.pause();
      if (audio) {
        // Without this block, after pressing the "play" button again, instead of picking up a current live audio stream, the player will play the old audio starting from the position when you first had clicked "play"
        audio.removeAttribute("src");
        audio.load();
      }
      setAudio(null);
    }
  }, [audio, isPlaying, url]);

  return { isPlaying, togglePlay };
}

//(audio && audio.readyState >= 3)
