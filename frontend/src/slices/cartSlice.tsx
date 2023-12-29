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

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}


interface CartState {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  shippingAddress: ShippingAddress;  
  paymentMethod: string;  
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
      paymentMethod: 'PayPal',
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
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    }, 
  },
});


export const { addToCart, removeFromCart, saveShippingAddress,savePaymentMethod,  clearCartItems} = cartSlice.actions;
export type { CartItem, CartState,ShippingAddress };

export default cartSlice.reducer;
