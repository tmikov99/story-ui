import { useEffect, useState } from "react";
import { PlaythroughData } from "../types/playthrough";
import { getLocalData, setLocalData, removeLocalData } from "../utils/storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { deletePlaythrough, fetchPlaythroughs, startPlaythrough } from "../api/playthrough";
import { showSnackbar } from "../redux/snackbarSlice";
import { useConfirmDialog } from "./ConfirmDialogProvider";

const buildKey = (storyId: number) => `playthrough-${storyId}`;

export const useUserPlaythrough = (storyId: number) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [playthroughs, setPlaythroughs] = useState<PlaythroughData[]>([]);
  const [currentPlaythrough, setCurrentPlaythrough] = useState<PlaythroughData | null>(null);
  const dispatch = useDispatch();
  const { showConfirm } = useConfirmDialog();

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const data = await fetchPlaythroughs(storyId);
          setPlaythroughs(data);
          setCurrentPlaythrough(data.find(p => p.active) || null);
        } catch (error) {
          dispatch(showSnackbar({ message: "Failed to fetch playthroughs.", severity: "error" }));
        }
      } else {
        const local = getLocalData<PlaythroughData>(buildKey(storyId));
        if (local) {
          setPlaythroughs([local]);
          setCurrentPlaythrough(local);
        }
      }
    };

    fetchData();
  }, [storyId]);

  const savePageLocal = (pageNumber: number) => {
    const updatedPath = [...(currentPlaythrough?.path || []), pageNumber];
    const newPlaythrough: PlaythroughData = {
      id: 1,
      storyId,
      currentPage: pageNumber,
      path: updatedPath,
      startedAt: currentPlaythrough?.startedAt || new Date().toISOString(),
      lastVisited: new Date().toISOString(),
    };
    setPlaythroughs([newPlaythrough]);
    setCurrentPlaythrough(newPlaythrough);
    setLocalData(buildKey(storyId), newPlaythrough);
  };

  const startNewPlaythrough = async () => {
    if (!isAuthenticated) {
      resetPlaythrough();
      return;
    }

    try {
      const newPlay = await startPlaythrough(storyId);
      dispatch(showSnackbar({ message: "New playthrough started.", severity: "success" }));
      return newPlay;
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to start new playthrough.", severity: "error" }));
    }
  };

  const loadPlaythrough = (id: number) => {
    const found = playthroughs.find(p => p.id === id);
    if (found) {
      setCurrentPlaythrough(found);
    }
  };

  const resetPlaythrough = () => {
    if (!isAuthenticated) {
      removeLocalData(buildKey(storyId));
      setPlaythroughs([]);
      setCurrentPlaythrough(null);
    } else {
      // TODO: Add API logic to delete/soft-reset playthrough
    }
  };

  const removePlaythrough = async (id: number) => {
    showConfirm({title: "Delete playthrough", message: "Delete this playthrough permanently?"}, async () => {
      if (!isAuthenticated) {
        // Handle local user delete
        // const updated = playthroughs.filter(p => p.startedAt !== currentPlaythrough?.startedAt);
        // removeLocalData(buildKey(storyId));
        // setPlaythroughs([]);
        // setCurrentPlaythrough(null);
        // return;
      }

      try {
        await deletePlaythrough(id);
        const updated = playthroughs.filter(p => p.id !== id);
        setPlaythroughs(updated);
        if (currentPlaythrough?.id === id) {
          setCurrentPlaythrough(null);
        }
        dispatch(showSnackbar({ message: "Playthrough deleted.", severity: "success" }));
      } catch (error) {
        dispatch(showSnackbar({ message: "Failed to delete playthrough.", severity: "error" }));
      }
    });
  };

  return {
    currentPlaythrough,
    playthroughs,
    // savePage,
    startNewPlaythrough,
    loadPlaythrough,
    resetPlaythrough,
    removePlaythrough,
  };
};