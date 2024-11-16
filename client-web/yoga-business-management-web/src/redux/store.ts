// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// Create the store using configureStore
const store = configureStore({
    reducer: {
        cart: cartReducer, // Reducer for the cart state
    },
});

// Export the store
export default store;
