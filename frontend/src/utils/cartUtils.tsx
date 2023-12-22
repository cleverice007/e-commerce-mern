import { CartState,CartItem } from '../slices/cartSlice';  


export const addDecimals = (num: number): number => {
    return Math.round(num * 100) / 100;
  };
  
  
  export const updateCart = (state: CartState): CartState => {
    // Calculate the items price in whole number (pennies) to avoid issues with
    // floating point number calculations
    const itemsPrice: number = state.cartItems.reduce(
      (acc: number, item: CartItem) => acc + (item.price * 100 * item.qty) / 100,
      0
    );
    state.itemsPrice = addDecimals(itemsPrice);
  
    // Calculate the shipping price
    const shippingPrice: number = itemsPrice > 100 ? 0 : 10;
    state.shippingPrice = addDecimals(shippingPrice);
  
    // Calculate the tax price
    const taxPrice: number = 0.15 * itemsPrice;
    state.taxPrice = addDecimals(taxPrice);
  
    const totalPrice: number = itemsPrice + shippingPrice + taxPrice;
    // Calculate the total price
    state.totalPrice = addDecimals(totalPrice);
  
    // Save the cart to localStorage
    localStorage.setItem('cart', JSON.stringify(state));
  
    return state;
  };