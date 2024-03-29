import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PrivateRoute from './components/PrivateRoute';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import OrderListPage from './pages/admin/OrderListPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UserListPage from './pages/admin/UserListPage';
import UserEditPage from './pages/admin/UserEditPage';
import { logout } from './slices/authSlice';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTimeString = localStorage.getItem('expirationTime');
    if (expirationTimeString) {
      const expirationTime = parseInt(expirationTimeString, 10);
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-3">
          <div className="container mx-auto">
            <Routes>
            <Route path="/" element={<Navigate replace to="/page/1" />} />
              <Route path='/page/:pageNumber' element={<HomePage />} />
              <Route path='/search/:keyword' element={<HomePage />} />
              <Route
                path='/search/:keyword/page/:pageNumber'
                element={<HomePage/>}
              />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path='' element={<PrivateRoute />}>
                <Route path='/shipping' element={<ShippingPage />} />
                <Route path='/payment' element={<PaymentPage />} />
                <Route path='/placeorder' element={<PlaceOrderPage />} />
                <Route path='/order/:id' element={<OrderPage />} />
                <Route path='/profile' element={<ProfilePage />} />
              </Route>
              <Route path='' element={<AdminRoute />}>
                <Route path='/admin/orderlist' element={<OrderListPage />} />
                <Route
                  path='/admin/productlist/:pageNumber'
                  element={<ProductListPage />}
                />
                <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
                <Route path='/admin/userlist' element={<UserListPage />} />
                <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
