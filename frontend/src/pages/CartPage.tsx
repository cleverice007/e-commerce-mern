import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart, CartState, CartItem } from '../slices/cartSlice';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state: { cart: CartState }) => state.cart);

    const addToCartHandler = (product: CartItem, qty: number) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
      };
    

    return (
        <>
        <div className="container mx-auto mt-5">
            <div className="flex flex-wrap -mx-3">
                <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
                    <h1 className="text-2xl mb-5">Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <div className="text-blue-500">Your cart is empty <Link to="/">Go Back</Link></div>
                    ) : (
                        <div className="bg-white shadow-md rounded my-6">
                            {cartItems.map((item: CartItem) => (
                                <div key={item._id} className="flex items-center px-6 py-5 border-b border-gray-200">
                                    <div className="w-1/6">
                                        <img src={item.image} alt={item.name} className="rounded" />
                                    </div>
                                    <div className="w-1/6">
                                        <Link to={`/product/${item._id}`} className="text-blue-500 hover:text-blue-600">{item.name}</Link>
                                    </div>
                                    <div className="w-1/6">${item.price}</div>
                                    <div className="w-1/6">
                                        <select
                                            className="form-select block w-full mt-1 border border-gray-300 rounded"
                                            value={item.qty}
                                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/6">
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => removeFromCartHandler(item._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-full md:w-1/3 px-3">
                    <div className="bg-white shadow-md rounded p-5">
                        <h2 className="text-xl mb-3">
                            Subtotal ({cartItems.reduce((acc: number, item: CartItem) => acc + item.qty, 0)})
                            items
                        </h2>
                        $
                        {cartItems.reduce((acc: number, item: CartItem) => acc + item.qty * item.price, 0).toFixed(2)}
                        <button
                            type="button"
                            className={`w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default CartPage;
