import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { CartState } from '../slices/cartSlice';
import exp from 'constants';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
  
    const cart = useSelector((state: { cart: CartState }) => state.cart);
  
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    function isError(err: unknown): err is Error {
        return err instanceof Error;
    }
  
    useEffect(() => {
      if (!cart.shippingAddress.address) {
        navigate('/shipping');
      } else if (!cart.paymentMethod) {
        navigate('/payment');
      }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);
  
    const dispatch = useDispatch();
    const placeOrderHandler = async () => {
      try {
        const res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
      } catch (err: unknown) {
        if (isError(err)) {
            toast.error(err.message);
        } else {
            toast.error('An unknown error occurred');
        }
    }
    };
    return (
        <>
          <CheckoutSteps step1 step2 step3 step4 />
          <div className="container mx-auto">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full md:w-2/3 px-3 mb-6">
                <div className="bg-white shadow-md rounded my-6">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3">Shipping</h2>
                    <p>
                      <strong>Address:</strong>
                      {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                      {cart.shippingAddress.postalCode},{' '}
                      {cart.shippingAddress.country}
                    </p>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3">Payment Method</h2>
                    <strong>Method: </strong>
                    {cart.paymentMethod}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3">Order Items</h2>
                    {cart.cartItems.length === 0 ? (
                      "Your cart is empty"
                    ) : (
                      <div>
                        {cart.cartItems.map((item, index) => (
                          <div key={index} className="flex items-center p-3 border-b border-gray-200">
                            <div className="w-1/12">
                              <img src={item.image} alt={item.name} className="rounded" />
                            </div>
                            <div className="w-8/12">
                              <Link to={`/products/${item._id}`} className="text-blue-500 hover:text-blue-700">
                                {item.name}
                              </Link>
                            </div>
                            <div className="w-3/12 text-right">
                              {item.qty} x ${item.price} = ${item.qty * item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
    
              <div className="w-full md:w-1/3 px-3">
                <div className="bg-white shadow-md rounded p-5">
                  <h2 className="text-xl font-bold mb-3">Order Summary</h2>
                  {isLoading && <div>Loading...</div>}
                  {error && <div>Error: {error.toString()}</div>}
                  <button
                    type="button"
                    onClick={placeOrderHandler}
                    className={`w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                      cart.cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={cart.cartItems.length === 0}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };
    
    export default PlaceOrderPage;