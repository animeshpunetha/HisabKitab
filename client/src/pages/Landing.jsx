import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="fixed left-0 right-0 top-0 z-50 px-6 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/30">
                            H
                        </div>
                        <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent hidden sm:block">
                            HisabKitab
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-xl bg-gray-900 px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105 hover:bg-black hover:shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="bg-linear-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl mb-6">
                            Digital Khata for <br />
                            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Modern Business
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Track payments, manage customers, and send reminders effortlessly.
                            The smartest way to maintain your ledger, completely free.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/register"
                                className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
                            >
                                Start for Free
                            </Link>
                            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
                                Existing User? <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="mx-auto mt-20 grid max-w-lg grid-cols-1 gap-8 sm:mt-24 sm:max-w-none sm:grid-cols-3">
                        <div className="glass-card p-8 transition-transform hover:-translate-y-1">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
                                👥
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">Customer Management</h3>
                            <p className="text-gray-500">Add unlimited customers and manage their details in one secure place.</p>
                        </div>
                        <div className="glass-card p-8 transition-transform hover:-translate-y-1">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl text-green-600">
                                💸
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">Track Transactions</h3>
                            <p className="text-gray-500">Record credits and debits instantly. Keep your balance sheet accurate.</p>
                        </div>
                        <div className="glass-card p-8 transition-transform hover:-translate-y-1">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl text-purple-600">
                                📱
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">Mobile First</h3>
                            <p className="text-gray-500">Designed for your phone. Use it as a PWA app without any installation.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; 2025 HisabKitab. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
