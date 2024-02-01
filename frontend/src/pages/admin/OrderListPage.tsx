import { Link } from 'react-router-dom';    
import { useGetOrdersQuery } from '../../slices/orderApiSlice';
import { Order } from '../../slices/orderApiSlice';


const OrderListPage: React.FC = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery({});


return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Orders</h1>
      {isLoading ? (
        <div className="text-blue-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">
          {error.toString()}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">ID</th>
              <th className="border border-gray-400 px-4 py-2">USER</th>
              <th className="border border-gray-400 px-4 py-2">DATE</th>
              <th className="border border-gray-400 px-4 py-2">TOTAL</th>
              <th className="border border-gray-400 px-4 py-2">PAID</th>
              <th className="border border-gray-400 px-4 py-2">DELIVERED</th>
              <th className="border border-gray-400 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order:Order) => (
              <tr key={order._id}>
                <td className="border border-gray-400 px-4 py-2">{order._id}</td>
                <td className="border border-gray-400 px-4 py-2">{order.user && order.user.name}</td>
                <td className="border border-gray-400 px-4 py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="border border-gray-400 px-4 py-2">${order.totalPrice}</td>
                <td className="border border-gray-400 px-4 py-2">
                  {order.isPaid ? (
                    order.paidAt!.substring(0, 10)
                  ) : (
                    <span className="text-red-500">Not Paid</span>
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {order.isDelivered ? (
                    order.deliveredAt?.substring(0, 10)
                  ) : (
                    <span className="text-red-500">Not Delivered</span>
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  <Link to={`/order/${order._id}`} className="text-blue-500 hover:text-blue-700">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;