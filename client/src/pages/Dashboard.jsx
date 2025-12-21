import useAuthStore from '../store/authStore';
import useTransactionStore from '../store/transactionStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const stats = useTransactionStore((state) => state.stats);
    const fetchDashboardStats = useTransactionStore((state) => state.fetchDashboardStats);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };


    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="glass-card mb-8 flex items-center justify-between p-6">
                    <div>
                        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
                    </div>
                </div>

                {deferredPrompt && (
                    <div className="glass-card mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-bold">Install HisabKitab</h3>
                                <p className="text-blue-100">Add to home screen for quick access.</p>
                            </div>
                            <button
                                onClick={handleInstallClick}
                                className="rounded-lg bg-white px-6 py-2 font-bold text-blue-600 shadow-md transition hover:bg-blue-50"
                            >
                                Install App
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Stats Cards */}
                    <div className="glass-card relative overflow-hidden p-6">
                        <div className="relative z-10">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">You Will Get</h2>
                            <p className="mt-2 text-3xl font-bold text-green-600">₹{stats?.totalToCollect || 0}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                                    &uarr;
                                </span>
                                <span className="text-xs font-medium text-gray-400">Total Receivables</span>
                            </div>
                        </div>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 blur-2xl"></div>
                    </div>

                    <div className="glass-card relative overflow-hidden p-6">
                        <div className="relative z-10">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">You Will Give</h2>
                            <p className="mt-2 text-3xl font-bold text-red-600">₹{stats?.totalToPay || 0}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                    &darr;
                                </span>
                                <span className="text-xs font-medium text-gray-400">Total Payables</span>
                            </div>
                        </div>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl"></div>
                    </div>

                    {/* Quick Action Card */}
                    <div
                        onClick={() => navigate('/customers')}
                        className="glass-card group cursor-pointer p-6 transition-all hover:border-blue-300 hover:shadow-blue-200"
                    >
                        <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">Manage Customers</h2>
                        <p className="mt-2 text-sm text-gray-500">View list, add new customers, and record transactions.</p>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-600">View All</span>
                            <span className="text-xl transition-transform group-hover:translate-x-1">&rarr;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
