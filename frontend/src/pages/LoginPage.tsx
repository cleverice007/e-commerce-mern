import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { AuthState,UserInfo } from '../slices/authSlice';

import { useLoginMutation,LoginRequest } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
    interface ApiError {
        data: {
          message: string;
        };
      }
      function isApiError(error: unknown): error is ApiError {
        return (
          typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          'message' in (error as ApiError).data
        );
      }
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [login,{ isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state: { auth: AuthState }) => state.auth);
  
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
  
    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const credentials: LoginRequest = {
          email: email,
          password: password,
        };
    
        const res = await login(credentials).unwrap();
    
        const userInfo: UserInfo = {
          id: (res as any).id as string,
          name: (res as any).name as string,
          email: (res as any).email as string,
        };
    
        dispatch(setCredentials(userInfo));
        navigate(redirect);
      } catch (error: unknown) {
        if (isApiError(error)) {
          toast.error(error.data.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    };
    
    return (
        <div className="max-w-md mx-auto my-10 p-8 bg-white shadow-md">
          <h1 className="text-xl font-semibold text-center">Sign In</h1>
    
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
    
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
    
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-2 text-white bg-blue-500 rounded-md ${isLoading ? 'opacity-50' : 'hover:bg-blue-700'}`}
            >
              Sign In
            </button>
    
            {isLoading && 'Loading...'}
          </form>
    
          <div className="text-center py-3">
            New Customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="text-blue-500 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      );
};

    export default LoginPage;