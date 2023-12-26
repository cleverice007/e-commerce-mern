import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/orderApiSlice';
import Message from '../components/Message';

const OrderPage: React.FC = () => {
    const { id: orderId } = useParams<{ id: string }>();

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-4">Order {order?._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading || error ? (
                    <div className="col-span-2">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>Error: {error.toString()}</div>)}
                    </div>
                ) : (
                    <>
                        {/* Shipping */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Shipping</h2>
                            <p>
                                <strong>Name:</strong> {order?.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong>{' '}
                                <a href={`mailto:${order?.user.email}`}>{order?.user.email}</a>
                            </p>
                            <p>
                                <strong>Address:</strong> {order?.shippingAddress.address},{' '}
                                {order?.shippingAddress.city} {order?.shippingAddress.postalCode},{' '}
                                {order?.shippingAddress.country}
                            </p>
                            {order?.isDelivered ? (
                                <Message variant="success">Delivered on {order?.deliveredAt}</Message>
                            ) : (
                                <Message variant="danger">Not Delivered</Message>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                            <p>
                                <strong>Method:</strong> {order?.paymentMethod}
                            </p>
                            {order?.isPaid ? (
                                <Message variant="success">Paid on {order?.paidAt}</Message>
                            ) : (
                                <Message variant="danger">Not Paid</Message>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="col-span-2">
                            <h2 className="text-xl font-semibold mb-2">Order Items</h2>
                            {order?.orderItems.length === 0 ? (
                                <Message>Order is empty</Message>
                            ) : (
                                <div>
                                    {order?.orderItems.map((item, index) => (
                                        <div key={index} className="mb-4">
                                            {/* Item details */}
                                            <div className="flex items-center">
                                                <div className="w-20 h-20 overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
