import React from 'react';
import { fakeProducts } from '../data/products';
import Rating from './Rating';

const ProductCard: React.FC = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fakeProducts.map((product) => (
          <div key={product._id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src={product.image} alt={product.name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{product.name}</div>
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
    );
  };
  
  
export default ProductCard;
