import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import {  CartState } from '../slices/cartSlice';


const PaymenPage = () => {
    const navigate = useNavigate();
    const cart = useSelector((state: { cart: CartState }) => state.cart);
    const { shippingAddress } = cart;
  
    useEffect(() => {
      if (!shippingAddress.address) {
        navigate('/shipping');
      }
    }, [navigate, shippingAddress]);
  
    const [paymentMethod, setPaymentMethod] = useState('ECPay');
  
    const dispatch = useDispatch();
  
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      dispatch(savePaymentMethod(paymentMethod));
      navigate('/placeorder');
    };
    return (
        <FormContainer>
          <CheckoutSteps step1 step2 step3 />
          <h1 className="text-xl font-bold">Payment Method</h1>
          <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <legend className="text-base font-medium text-gray-900">Select Method</legend>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    className="form-radio my-2"
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2">綠界</span>
                </label>
              </div>
            </div>
    
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Continue
            </button>
          </form>
        </FormContainer>
      );
    };
    
    export default PaymenPage;