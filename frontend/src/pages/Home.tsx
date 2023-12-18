import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Product from '../components/Product';

const Home = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-grow">
          <Product />
        </main>
        <Footer />
      </div>
    );
  };

export default Home;
