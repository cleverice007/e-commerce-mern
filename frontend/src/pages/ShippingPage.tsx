import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress, CartState } from '../slices/cartSlice';
import CheckoutSteps  from '../components/CheckoutSteps';

const ShippingPage = () => {
  const cart = useSelector((state: { cart: CartState }) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <CheckoutSteps step1 step2 />
      <h1 className="text-2xl font-bold mb-4">Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className='mb-4'>
          <label htmlFor='address' className='block text-sm font-medium text-gray-700'>Address</label>
          <input
            type='text'
            id='address'
            placeholder='Enter address'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='city' className='block text-sm font-medium text-gray-700'>City</label>
          <input
            type='text'
            id='city'
            placeholder='Enter city'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='postalCode' className='block text-sm font-medium text-gray-700'>Postal Code</label>
          <input
            type='text'
            id='postalCode'
            placeholder='Enter postal code'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='country' className='block text-sm font-medium text-gray-700'>Country</label>
          <input
            type='text'
            id='country'
            placeholder='Enter country'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <button type='submit' className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'>
          Continue
        </button>
      </form>
    </div>
  );
};



export default ShippingPage;
