import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/userApiSlice'



const UserListPage: React.FC = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery({});
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    interface User {
        _id: string;
        name: string;
        email: string;
        isAdmin: boolean;
      }
      

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteUser(id);
                refetch();
            } catch (err) {
                const error = err as { data?: { message?: string }; error?: string };
                alert(error.data?.message || error.error || 'An unknown error occurred');
            }
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold">Users</h1>
            {isLoading ? (
                <div className="mt-4">Loading...</div>
            ) : error ? (
                <div className="mt-4">{error.toString()}</div>
            ) : (
                <>
                    <table className="mt-4 w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">NAME</th>
                                <th className="py-2 px-4 border">EMAIL</th>
                                <th className="py-2 px-4 border">ADMIN</th>
                                <th className="py-2 px-4 border"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users? (
                                users.map((user:User) => (
                                    <tr key={user._id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border">{user._id}</td>
                                        <td className="py-2 px-4 border">{user.name}</td>
                                        <td className="py-2 px-4 border">
                                            <a href={`mailto:${user.email}`}>{user.email}</a>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {user.isAdmin ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {!user.isAdmin && (
                                                <>
                                                    <Link
                                                        to={`/admin/user/${user._id}/edit`}
                                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => deleteHandler(user._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-2 px-4 border">
                                        Users is empty
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </>
    );
};

export default UserListPage;
