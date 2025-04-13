import { useEffect, useState } from "react";
import { PlaythroughData } from "../types/playthrough";
import { getLocalData, setLocalData, removeLocalData } from "../utils/storage";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchPlaythrough, startPlaythrough, updatePlaythrough } from "../api/playthrough";

const buildKey = (storyId: number) => `playthrough-${storyId}`;

export const useUserPlaythrough = (storyId: number) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [playthrough, setPlaythrough] = useState<PlaythroughData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let data: PlaythroughData | null = null;

      if (isAuthenticated) {
        try {
          data = await fetchPlaythrough(storyId);
        } catch (error) {
          console.error("Failed to fetch playthrough from API", error);
        }
      } else {
        data = getLocalData<PlaythroughData>(buildKey(storyId));
      }

      if (data) {
        setPlaythrough(data);
      }
    };

    fetchData();
  }, [storyId]);


  const savePage = (pageNumber: number) => {
    if (!isAuthenticated) {
      savePageLocal(pageNumber);
    } else {
      savePageBackend(pageNumber);
    }
  };

  const savePageLocal = (pageNumber: number) => {
    const updatedPath = [...(playthrough?.path || []), pageNumber];
    const newPlaythrough: PlaythroughData = {
      storyId,
      currentPage: pageNumber,
      path: updatedPath,
      lastVisited: new Date().toISOString(),
    };
    setPlaythrough(newPlaythrough);
    setLocalData(buildKey(storyId), newPlaythrough);
  }

  const savePageBackend = async (pageNumber: number) => {
    let newPlaythrough: PlaythroughData | null = null;
      try {
        newPlaythrough = await (playthrough === null ? startPlaythrough(storyId) : updatePlaythrough(storyId, pageNumber));
      } catch (error) {
        console.error("Failed to fetch playthrough from API", error);
      }
      if (newPlaythrough) {
        setPlaythrough(newPlaythrough);
      }
  }

  const resetPlaythrough = () => {
    if (!isAuthenticated) {
      removeLocalData(buildKey(storyId));
    } else {
      // TODO: Add an API call to clear playthrough server-side
    }
    setPlaythrough(null);
  };

  return {
    playthrough,
    savePage,
    resetPlaythrough
  };
};