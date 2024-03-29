import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { OrderItem } from '../slices/orderApiSlice';
import { AuthState } from '../slices/authSlice';
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useDeliverOrderMutation,
} from '../slices/orderApiSlice';
import Message from '../components/Message';

const OrderPage: React.FC = () => {


    const { id: orderId } = useParams<{ id: string }>();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [deliverOrder, { isLoading: loadingDeliver }] =
        useDeliverOrderMutation();


    const { userInfo } = useSelector((state: { auth: AuthState }) => state.auth);

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery(undefined);

    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
    };

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        clientId: paypal.clientId,
                        currency: 'USD',
                    },
                });
            };
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript();
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);


    function onApprove(data: any, actions: any) {
        return actions.order.capture().then(async function (details: any) {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success('Order is paid');
            } catch (err: unknown) {
                const e = err as { data?: { message?: string }, error?: string }; // 斷言類型
                toast.error(e.data?.message || e.error || "An unknown error occurred");
            }
        });
    }

    async function onApproveTest() {
        await payOrder({ orderId, details: { payer: {} } });
        refetch();

        toast.success('Order is paid');
    }

    function onError(err: Record<string, unknown>) {
        const message = err.message as string;  // 斷言message是字符串
        toast.error(message || "An unknown error occurred");
    }


    function createOrder(data: any, actions: any): Promise<any> {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: order.totalPrice.toString() },
                    },
                ],
            })
            .then((orderID: any) => {
                return orderID;
            });
    }


    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-4">Order {order?._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading || error ? (
                    <div className="col-span-2">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>Error: {error.toString()}</div>
                        )}
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
                                    {order?.orderItems.map((item: OrderItem, index: number) => (
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
                        {/* Order Summary */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="bg-white shadow-md rounded my-6 p-6">
                                <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
                                <div className="mb-4">
                                    <div className="flex justify-between">
                                        <div>Items</div>
                                        <div>${order.itemsPrice}</div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between">
                                        <div>Shipping</div>
                                        <div>${order.shippingPrice}</div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between">
                                        <div>Tax</div>
                                        <div>${order.taxPrice}</div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between">
                                        <div>Total</div>
                                        <div>${order.totalPrice}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!order.isPaid && (
                            <div className="list-group-item">
                                {loadingPay && <div>Loading...</div>}

                                {isPending ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div>
                                        <button
                                            className="mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={onApproveTest}
                                        >
                                            Test Pay Order
                                        </button>

                                        <div>
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            ></PayPalButtons>
                                        </div>
                                    </div>
                                )}
                            </div>

                        )}
                        {loadingDeliver && <div>Loading...</div>}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={deliverHandler}
                                >
                                    Mark As Delivered
                                </button>
                            </div>
                        )}

                    </>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
