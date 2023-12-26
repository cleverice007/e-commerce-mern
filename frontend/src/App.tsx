import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PrivateRoute from './components/PrivateRoute';
import PlaceOrderPage from './pages/PlacehOrderPage';
import OrderPage from './pages/OrderPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-3">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path='' element={<PrivateRoute />}>
                <Route path='/shipping' element={<ShippingPage />} />
                <Route path='/payment' element={<PaymentPage />} />
                <Route path='/placeorder' element={<PlaceOrderPage />} />
                <Route path='/order/:id' element={<OrderPage />} />
              </Route>
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
