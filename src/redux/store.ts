import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import teamsReducer from "./slices/TeamSlice";

/* ---------------- persist config ---------------- */
const persistConfig = {
  key: "root",
  storage,
};

/* ---------------- root reducer ---------------- */
const appReducer = combineReducers({
  teams: teamsReducer,
});

/* 🔥 global reset handler */
const rootReducer = (state: any, action: any) => {
  if (action.type === "app/reset") {
    state = undefined; // resets redux state
  }
  return appReducer(state, action);
};

/* ---------------- persisted reducer ---------------- */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ---------------- store ---------------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

/* ---------------- persistor ---------------- */
export const persistor = persistStore(store);

/* ---------------- reset action ---------------- */
export const resetApp = () => ({ type: "app/reset" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
