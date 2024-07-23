import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import App from "./App";
import { authSlice } from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

// Configuration for Redux Persist
const persistConfig = { key: "root", storage, version: 1 };
const authReducer = authSlice.reducer;
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor object
const persistor = persistStore(store);

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root")); // Updated method
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
