// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import videoReducer, { VideoState } from "./videoSlice";

import storage from "redux-persist/lib/storage"; // localStorage for web
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  video: videoReducer,
});

// Export a RootState type for useSelector typing (simple, stable shape)
export type RootState = {
  video: VideoState;
};

// factory that creates a store + persistor per userId
export const makeStore = (userId?: string) => {
  const persistConfig = {
    key: `student_${userId ?? "guest"}`, // ← per-user key
    storage,
    whitelist: ["video"],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // ignore redux-persist action types
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type AppDispatch = AppStore extends { dispatch: infer D } ? D : never;
