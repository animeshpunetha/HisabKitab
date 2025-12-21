import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 md:p-10">
                <div className="mb-8 text-center">
                    <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                        HisabKitab
                    </h1>
                    <p className="mt-2 text-gray-500">Welcome back! Please login to continue.</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
