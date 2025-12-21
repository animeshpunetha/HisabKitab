import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-lg">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/30">
                        H
                    </div>
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-xl font-semibold text-transparent hidden sm:block">
                        HisabKitab
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-1 sm:gap-4">
                    <Link
                        to="/dashboard"
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive('/dashboard')
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/customers"
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive('/customers')
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        Customers
                    </Link>
                </div>

                {/* Logout Action */}
                <button
                    onClick={handleLogout}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                    title="Logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
