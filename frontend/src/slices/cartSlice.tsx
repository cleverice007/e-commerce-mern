import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addDecimals,updateCart } from '../utils/cartUtils';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  countInStock: number;
}

interface CartState {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const initialState: CartState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart')!)
  : {
      cartItems: [],
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      shippingAddress: {}, 
      paymentMethod: 'ECPay',
    };




const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If exists, update quantity
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // If not exists, add new item to cartItems
        state.cartItems = [...state.cartItems, item];
      }

      // Update the prices and save to storage
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      // Filter out the item to remove from the cart
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Update the prices and save to storage
      return updateCart(state);
    },
  },
});


export const { addToCart, removeFromCart } = cartSlice.actions;
export type { CartItem, CartState };

export default cartSlice.reducer;
