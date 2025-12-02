import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalItems: 0,
  cartMessage: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const cartItem = action.payload.item;
      console.log(cartItem.id);

      const isItemExist = state.cartItems.some(
        (item) => cartItem.id === item.id
      );

      if (isItemExist) {
        state.cartMessage = "Item already exists";
        console.log("matched");
        return;
      }

      state.cartItems.push(cartItem);
      localStorage.setItem(
        `cartItems:${action.payload.userId}`,
        JSON.stringify(state.cartItems)
      );
      state.cartMessage = "Item added to cart";
    },
    setLocalStorageCartItems(state, action) {
      state.cartItems = action.payload;
    },
    setCartMessage(state, action) {
      state.cartMessage = action.payload;
    },
    setLocalStorage(state,action){
      localStorage.setItem(
        `cartItems:${action.payload.userId}`,
        JSON.stringify([])
      );
    },
    removeFromCart(state, action) {
      const courseId = action.payload.courseId;
      const filteredCart = state.cartItems.filter(
        (item) => item.id !== courseId
      );
      state.cartItems = filteredCart;
      localStorage.setItem(
        `cartItems:${action.payload.userId}`,
        JSON.stringify(state.cartItems)
      );
    },
  },
});

export const {
  addToCart,
  setCartMessage,
  setLocalStorageCartItems,
  removeFromCart,
  setLocalStorage
} = cartSlice.actions;
export default cartSlice.reducer;
