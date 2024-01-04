import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';
import { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productSlice';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState } from '../slices/authSlice';


const ProductPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product!, qty }));
    navigate('/cart');
  };

  const { data: product, isLoading,
    error, refetch,
  } = useGetProductDetailsQuery(productId || 'undefined');

  const { userInfo } = useSelector((state: { auth: AuthState }) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };
      alert(error.data?.message || error.error || 'An unknown error occurred');
    }
  };


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
            {product.countInStock > 0 && (
              <div className="mb-2">
                <div className="flex justify-between">
                  <div>Qty</div>
                  <div>
                    <select
                      className="w-16 p-1 border rounded"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            <button
              className={`w-full bg-blue-500 text-white py-2 rounded ${product.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="col-span-1">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <div className="space-y-4">
            {product.reviews ? (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                  <strong className="text-lg">{review.name}</strong>
                  <Rating value={review.rating} />
                  {review.createdAt && (
                    <p className="text-gray-500">
                      {review.createdAt instanceof Date
                        ? review.createdAt.toISOString().substring(0, 10)
                        : ''}
                    </p>
                  )}
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <div>No reviews available.</div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Write a Customer Review</h2>

            {loadingProductReview && <p>Loading...</p>}

            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div className="mb-4">
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <button
                  disabled={loadingProductReview}
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-gray-600">
                Please{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                  sign in
                </Link>{' '}
                to write a review
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;

