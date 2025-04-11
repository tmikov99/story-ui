import { useEffect, useState } from "react";
import { PlaythroughData } from "../types/playthrough";
import { getLocalData, setLocalData, removeLocalData } from "../utils/storage";

const buildKey = (storyId: number) => `playthrough-${storyId}`;

export const useUserPlaythrough = (storyId: number) => {
  const [playthrough, setPlaythrough] = useState<PlaythroughData | null>(null);

  useEffect(() => {
    const data = getLocalData<PlaythroughData>(buildKey(storyId));
    if (data) {
      setPlaythrough(data);
    }
  }, [storyId]);

  const savePage = (pageId: string) => {
    const updatedPath = [...(playthrough?.path || []), pageId];
    const newPlaythrough: PlaythroughData = {
      storyId,
      path: updatedPath,
      lastVisited: new Date().toISOString()
    };
    setPlaythrough(newPlaythrough);
    setLocalData(buildKey(storyId), newPlaythrough);
  };

  const resetPlaythrough = () => {
    removeLocalData(buildKey(storyId));
    setPlaythrough(null);
  };

  return {
    playthrough,
    savePage,
    resetPlaythrough
  };
};