import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery, useUpdateUserMutation} from '../../slices/userApiSlice';

const UserEditPage: React.FC = () => {
    const { id: userId } = useParams<{ id: string }>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
    const {
      data: user,
      isLoading,
      error,
      refetch,
    } = useGetUserDetailsQuery(userId);
  
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  
    const navigate = useNavigate();
  
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await updateUser({ userId, name, email, isAdmin });
        toast.success('User updated successfully');
        refetch();
        navigate('/admin/userlist');
      } catch (err) {
        const error = err as { data?: { message?: string }; error?: string };
        alert(error.data?.message || error.error || 'An unknown error occurred');      }
    };
  
    useEffect(() => {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }, [user]);
  
    return (
        <>
          <Link to='/admin/userlist' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 inline-block'>
            Go Back
          </Link>
          <FormContainer>
            <h1 className="text-2xl font-semibold">Edit User</h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="mt-4 text-red-500">{error.toString()}</div>
            ) : (
              <form onSubmit={submitHandler} className="mt-4">
                <div className='my-2'>
                  <label htmlFor='name' className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type='name'
                    id='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none py-2 px-3"
                  />
                </div>
      
                <div className='my-2'>
                  <label htmlFor='email' className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type='email'
                    id='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none py-2 px-3"
                  />
                </div>
      
                <div className='my-2'>
                  <label htmlFor='isadmin' className="block text-sm font-medium text-gray-700">Is Admin</label>
                  <input
                    type='checkbox'
                    id='isadmin'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </div>
      
                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                  Update
                </button>
              </form>
            )}
          </FormContainer>
        </>
      );
};
  
  export default UserEditPage;