import { useState, useEffect, useMemo } from 'react';
import useCustomerStore from '../store/customerStore';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
    const customers = useCustomerStore((state) => state.customers);
    const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);
    const addCustomer = useCustomerStore((state) => state.addCustomer);
    const loading = useCustomerStore((state) => state.loading);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery)
        );
    }, [customers, searchQuery]);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            await addCustomer({ name, phone });
            setIsModalOpen(false);
            setName('');
            setPhone('');
        } catch (error) {
            // Error managed by store
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header Actions Row */}
                <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-5xl font-bold text-transparent">
                            Customers
                        </h1>
                        <p className="mt-2 text-lg text-gray-500">Manage your contacts and track transactions</p>
                    </div>

                    <div className="glass-card flex items-center gap-3 p-1.5">
                        <button
                            onClick={() => fetchCustomers()}
                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                            title="Refresh List"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
                        >
                            <span className="text-xl leading-none">+</span>
                            <span>Add New Customer</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar Row */}
                <div className="glass-card mb-8 p-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
                            className="w-full rounded-xl border-none bg-transparent py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Customer List */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loading && (
                        <div className="col-span-full py-12 text-center text-gray-500 animate-pulse">Loading customers...</div>
                    )}

                    {!loading && filteredCustomers.length === 0 && (
                        <div className="col-span-full glass-card py-16 text-center">
                            <div className="mb-4 text-4xl">🔍</div>
                            <h3 className="text-lg font-bold text-gray-800">No customers found</h3>
                            <p className="text-gray-500">
                                {searchQuery ? `No results for "${searchQuery}"` : "Add your first customer to start tracking!"}
                            </p>
                        </div>
                    )}

                    {filteredCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            onClick={() => navigate(`/customer/${customer.id}`)}
                            className="glass-card group relative cursor-pointer overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
                        >
                            {/* <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div> */}

                            <div className="flex items-start justify-between">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                                    View &rarr;
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{customer.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {customer.phone}
                                </p>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const cleanPhone = customer.phone.replace(/\D/g, '');
                                            const phoneNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                                            window.open(`https://wa.me/${phoneNumber}`, '_blank');
                                        }}
                                        className="rounded-full bg-green-100 p-2 text-green-600 hover:bg-green-200 transition-colors"
                                        title="Chat on WhatsApp"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.272-.57-.421m-4.219 2.919l-.325.204-.31-.194c-1.839-1.147-3.666-2.294-5.492-3.441l-.224-.141-.214.155c-1.459 1.054-2.918 2.109-4.377 3.163l-.224.162.247-.141c2.185-1.247 4.37-2.494 6.556-3.741l.247-.141.247.141c2.186 1.247 4.371 2.494 6.557 3.741l.247.141-.129-.208zM12 2C6.486 2 2 6.486 2 12c0 1.846.505 3.568 1.401 5.05L2.3 21.7l4.764-1.066C8.487 21.432 10.187 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.476 0-2.885-.393-4.103-1.082l-.294-.166-2.843.636.657-2.756-.179-.304C4.464 15.368 4 13.727 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="glass-card w-full max-w-md p-8 animate-scale-up">
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">New Customer</h2>
                        <p className="mb-6 text-sm text-gray-500">Enter details to create a new contact.</p>

                        <form onSubmit={handleAddCustomer} className="space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Rahul Kumar"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 98765 43210"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-auto px-6"
                                >
                                    {loading ? 'Creating...' : 'Create Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
