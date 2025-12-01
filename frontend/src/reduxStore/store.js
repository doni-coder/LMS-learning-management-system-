import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import courseReducer from "./courseSlice";
import cartReducer from "./cartSlice";
import appReducer from "./appSlice";

export const store = configureStore({
  reducer: {
    user: userReducer || null,
    course: courseReducer || null,
    cart: cartReducer || null,
    app: appReducer
  },
});
