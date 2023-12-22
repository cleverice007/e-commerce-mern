import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';
import { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useGetProductDetailsQuery } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';

const ProductPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product!, qty }));
    navigate('/cart');
  };

  const { data: product, isLoading, error } = useGetProductDetailsQuery(
    productId || 'undefined'
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <>
      <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 my-3">
        <AiOutlineArrowLeft className="mr-2" /> Go Back
      </Link>
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3">
          <img className="w-full h-auto object-cover rounded" src={product.image} alt={product.name} />
        </div>
        <div className="w-full md:w-1/4 px-3">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            <div>Price: ${product.price}</div>
            <div>{product.description}</div>
          </div>
        </div>
        <div className="w-full md:w-1/4 px-3">
          <div className="border border-gray-200 p-4 rounded">
            <div className="mb-2">
              <div className="flex justify-between">
                <div>Price:</div>
                <div className="font-bold">${product.price}</div>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between">
                <div>Status:</div>
                <div>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</div>
              </div>
            </div>

            <button
              className={`w-full bg-blue-500 text-white py-2 rounded ${
                product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="button"
              disabled={product.countInStock === 0}
              onClick={addToCartHandler} 
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;

