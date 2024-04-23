import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productId: null,
  productName: null,
  productQty: null,
  productPrice: null,
  
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.productId = action.payload.productId;
      state.productName = action.payload.productName;
      state.productQty = action.payload.productQty;
      state.productPrice = action.payload.productPrice;
    },
    removeFromCart: (state) => {
      state.productId = null;
      state.productName = null;
      state.productQty = null;
      state.productPrice = null;
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;

