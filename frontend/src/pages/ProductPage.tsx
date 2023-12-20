import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { fakeProducts , Product } from '../data/products'; 
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useGetProductDetailsQuery } from '../slices/productSlice';


const ProductPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    error,
  } = productId ? useGetProductDetailsQuery(productId) : { data: null, isLoading: false, error: null };


  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <>
     isLoading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>error</div>
    ) : (
      <Link to='/' className='flex items-center text-blue-600 hover:text-blue-800 my-3'>
        <AiOutlineArrowLeft className='mr-2' /> Go Back
      </Link>
      <div className='flex flex-wrap -mx-3'>
        <div className='w-full md:w-1/2 px-3'>
          <img className='w-full h-auto object-cover rounded' src={product.image} alt={product.name} />
        </div>
        <div className='w-full md:w-1/4 px-3'>
          <div className='space-y-2'>
            <h3 className='text-xl font-bold'>{product.name}</h3>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            <div>Price: ${product.price}</div>
            <div>{product.description}</div>
          </div>
        </div>
        <div className='w-full md:w-1/4 px-3'>
          <div className='border border-gray-200 p-4 rounded'>
            <div className='mb-2'>
              <div className='flex justify-between'>
                <div>Price:</div>
                <div className='font-bold'>${product.price}</div>
              </div>
            </div>

            <div className='mb-2'>
              <div className='flex justify-between'>
                <div>Status:</div>
                <div>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</div>
              </div>
            </div>

            <button
              className={`w-full bg-blue-500 text-white py-2 rounded ${
                product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type='button'
              disabled={product.countInStock === 0}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    )
    </>
  );
};

export default ProductPage;
