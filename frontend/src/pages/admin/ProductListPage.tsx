import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import { useGetProductsQuery } from '../../slices/productSlice';
import { Link } from 'react-router-dom';


const ProductListPage: React.FC = () => {
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const deleteHandler = (id: string) => { };



    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link to="/admin/create-product" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                    <FaPlus className="mr-1" /> Create Product
                </Link>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error.toString()}</div>
            ) : (
                <>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">NAME</th>
                                <th className="border border-gray-300 px-4 py-2">PRICE</th>
                                <th className="border border-gray-300 px-4 py-2">CATEGORY</th>
                                <th className="border border-gray-300 px-4 py-2">BRAND</th>
                                <th className="border border-gray-300 px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products ? (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{product._id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">${product.price}</td>
                                        <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                                        <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <Link to={`/admin/product/${product._id}/edit`} className="text-blue-500 hover:text-blue-700 mr-2">
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => deleteHandler(product._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>No products found</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </>
            )}
        </>
    );
};

export default ProductListPage;