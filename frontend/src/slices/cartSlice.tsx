import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const addDecimals = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      state.itemsPrice = parseFloat(
        addDecimals(
          state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
      );

      state.shippingPrice = parseFloat(
        addDecimals(state.itemsPrice > 100 ? 0 : 10)
      );

      state.taxPrice = parseFloat(
        addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)))
      );

      state.totalPrice = parseFloat(
        (
          state.itemsPrice +
          state.shippingPrice +
          state.taxPrice
        ).toFixed(2)
      );

      // Save the cart to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart } = cartSlice.actions;
export type { CartItem, CartState };

export default cartSlice.reducer;
