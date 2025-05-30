import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";

import authReducer from "./authSlice";
import workspaceReducer from "./workspacesSlice";
import projectReducer from "./projectSlice";
import { authTransform } from "./transfrom";

// 1. Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  project: projectReducer,
});

// 2. Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "workspace", "project"], // slices to persist
  transforms: [ authTransform ]
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

// 3. Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist needs this
    }),
});

// 4. Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
