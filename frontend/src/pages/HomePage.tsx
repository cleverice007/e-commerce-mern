import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useEffect,useState } from 'react';

const HomePage: React.FC = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-grow">
          <ProductCard />
        </main>
        <Footer />
      </div>
    );
  };

export default HomePage;