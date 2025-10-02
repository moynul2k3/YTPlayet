// src/store/videoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoState {
  currentVideoId: string | null;
  playingVideoId: string | null;
  completedVideos: string[];        // use arrays for serializable persistence
  unlockedVideos: string[];         // array instead of Set
  progressMap: Record<string, number>;
  maxProgressMap: Record<string, number>;
}

const initialState: VideoState = {
  currentVideoId: null,
  playingVideoId: null,
  completedVideos: [],
  unlockedVideos: [],
  progressMap: {},
  maxProgressMap: {},
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoId(state, action: PayloadAction<string>) {
      state.currentVideoId = action.payload;
    },
    setPlaying(
      state,
      action: PayloadAction<{ id: string | null; isPlaying: boolean }>
    ) {
      state.playingVideoId = action.payload.isPlaying
        ? action.payload.id
        : null;
    },
    setProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      const { id, progress } = action.payload;
      state.progressMap[id] = progress;
      state.maxProgressMap[id] = Math.max(state.maxProgressMap[id] || 0, progress);
      if (progress >= 100 && !state.completedVideos.includes(id)) {
        state.completedVideos.push(id);
      }
    },
    unlockVideo(state, action: PayloadAction<string>) {
      if (!state.unlockedVideos.includes(action.payload)) {
        state.unlockedVideos.push(action.payload);
      }
    },
    markCompleted(state, action: PayloadAction<string>) {
      if (!state.completedVideos.includes(action.payload)) {
        state.completedVideos.push(action.payload);
      }
    },
    resetVideoState() {
      return initialState;
    },
  },
});

export const {
  setVideoId,
  setPlaying,
  setProgress,
  unlockVideo,
  markCompleted,
  resetVideoState,
} = videoSlice.actions;

export default videoSlice.reducer;


