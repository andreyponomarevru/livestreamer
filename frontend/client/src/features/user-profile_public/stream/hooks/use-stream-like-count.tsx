import * as React from "react";

type Context = {
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  likeCount: number;
};

function useStreamLikeCount(count = 0) {
  const [likeCount, setLikeCount] = React.useState(count);

  return { likeCount, setLikeCount };
}

const StreamLikeCountContext = React.createContext<Context>({
  setLikeCount: () => {},
  likeCount: 0,
});

function StreamLikeCountProvider({ children }: { children: React.ReactNode }) {
  const streamLikeCount = useStreamLikeCount();
  return (
    <StreamLikeCountContext.Provider value={streamLikeCount}>
      {children}
    </StreamLikeCountContext.Provider>
  );
}

function StreamLikeCountConsumer(): Context {
  return React.useContext(StreamLikeCountContext);
}

export {
  StreamLikeCountProvider,
  StreamLikeCountConsumer as useStreamLikeCount,
};
