import { useState, useEffect } from "react";

function useStreamTimer(startedAt: string): string {
  function getPassedTime(startedAt: number): string {
    const msTimePassed = Date.now() - startedAt;
    return new Date(msTimePassed).toISOString().substring(11, 19);
  }

  const streamStartedAt = new Date(startedAt).getTime();
  const [time, setTime] = useState<string>(getPassedTime(streamStartedAt));

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(getPassedTime(streamStartedAt));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [streamStartedAt]);

  return time;
}

export { useStreamTimer };
