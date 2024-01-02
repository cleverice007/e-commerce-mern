import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../slices/productSlice';

const ProductEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id: productId } = useParams<{ id: string }>();


  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [countInStock, setCountInStock] = useState<number>(0);
  const [description, setDescription] = useState<string>('');

  const { data: product, isLoading, error,refetch } = useGetProductDetailsQuery(
    productId || 'undefined'
  );

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      });
      toast.success('Product updated successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
        const error = err as { data?: { message?: string }, error?: string };
        toast.error(error.data?.message || error.error || "An unknown error occurred");    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);
  
  return (
    <div>
      <Link to='/admin/productlist' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Go Back
      </Link>
      <div className='p-4'>
        <h1 className='text-3xl font-bold'>Edit Product</h1>
        {loadingUpdate && <div>Loading...</div>}
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className='text-red-500'>{error.toString()}</div>
        ) : (
          <form onSubmit={submitHandler} className='mt-4'>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                Name
              </label>
              <input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='price'>
                Price
              </label>
              <input
                id='price'
                type='number'
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className='block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
              />
            </div>

            {/* IMAGE INPUT PLACEHOLDER */}

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='brand'>
                Brand
              </label>
              <input
                id='brand'
                type='text'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='countInStock'>
                Count In Stock
              </label>
              <input
                id='countInStock'
                type='number'
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                className='block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='category'>
                Category
              </label>
              <input
                id='category'
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='description'>
                Description
              </label>
              <input
                id='description'
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
  
  export default ProductEditPage;