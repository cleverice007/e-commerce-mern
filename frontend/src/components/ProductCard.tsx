import React from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productSlice';
import {Product} from '../data/products'

const ProductCard: React.FC = () => {
  const { data: products, isLoading, error } = useGetProductsQuery() as { data: Product[], isLoading: boolean, error: unknown };

  return (
    isLoading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>error</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((product: Product) => (
          <div key={product._id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src={product.image} alt={product.name} />
            <div className="px-6 py-4">
              <Link to={`/products/${product._id}`}>
                <div className="font-bold text-xl mb-2">{product.name}</div>
              </Link>
              <p className="text-gray-700 text-base">{product.description}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <div className="text-xl mb-2">${product.price}</div>
              <div className="text-gray-700 text-base">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
  };
  
  
export default ProductCard;
