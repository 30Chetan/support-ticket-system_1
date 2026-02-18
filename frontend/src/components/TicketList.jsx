import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TicketList = ({ refreshTrigger }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        priority: '',
        status: '',
        search: ''
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await axios.get(`${API_URL}/api/tickets/?${params.toString()}`);
            setTickets(response.data);
        } catch (err) {
            console.error("Error fetching tickets:", err);
        } finally {
            setLoading(false);
        }
    }, [filters, API_URL]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets, refreshTrigger]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`${API_URL}/api/tickets/${id}/`, { status: newStatus });
            setTickets(prev => prev.map(ticket =>
                ticket.id === id ? { ...ticket, status: newStatus } : ticket
            ));
        } catch (err) {
            console.error("Error updating ticket status:", err);
            alert("Failed to update status");
            fetchTickets();
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-50 text-red-700 ring-red-600/20';
            case 'high': return 'bg-orange-50 text-orange-700 ring-orange-600/20';
            case 'medium': return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
            case 'low': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            default: return 'bg-gray-50 text-gray-600 ring-gray-500/10';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">🔍</span>
                        </div>
                        <input
                            type="text"
                            name="search"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Search tickets..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">All Categories</option>
                        <option value="billing">Billing</option>
                        <option value="technical">Technical</option>
                        <option value="account">Account</option>
                        <option value="general">General</option>
                    </select>

                    <select
                        name="priority"
                        value={filters.priority}
                        onChange={handleFilterChange}
                        className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-indigo-600 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tickets.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            No tickets found matching your filters.
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <div key={ticket.id} className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md border border-gray-100">
                                <div className={`absolute top-0 left-0 w-1 h-full ${ticket.priority === 'critical' ? 'bg-red-500' :
                                        ticket.priority === 'high' ? 'bg-orange-400' :
                                            ticket.priority === 'medium' ? 'bg-green-400' : 'bg-blue-400'
                                    }`}></div>

                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-2" title={ticket.title}>
                                            {ticket.title}
                                        </h3>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 line-clamp-3">
                                            {ticket.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 capitalize">
                                            {ticket.category}
                                        </span>
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 font-medium ring-1 ring-inset capitalize ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </span>

                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                        className="block w-32 rounded border-0 py-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6 bg-white"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketList;
