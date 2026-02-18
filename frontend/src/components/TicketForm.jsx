import { useState } from 'react';
import axios from 'axios';

const TicketForm = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
    });

    const [loadingAI, setLoadingAI] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDescriptionBlur = async () => {
        if (!formData.description || formData.description.length < 10) return;

        setLoadingAI(true);
        try {
            const response = await axios.post(`${API_URL}/api/tickets/classify/`, {
                description: formData.description
            });

            const { suggested_category, suggested_priority } = response.data;

            if (suggested_category || suggested_priority) {
                setFormData(prev => ({
                    ...prev,
                    category: suggested_category || prev.category,
                    priority: suggested_priority || prev.priority
                }));
            }
        } catch (err) {
            console.error("AI Classification failed", err);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.post(`${API_URL}/api/tickets/`, formData);

            setFormData({
                title: '',
                description: '',
                category: 'general',
                priority: 'medium'
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            if (onTicketCreated) {
                onTicketCreated();
            }
        } catch (err) {
            console.error("Error creating ticket", err);
            setError("Failed to create ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Create New Ticket</h3>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="rounded-md bg-green-50 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Ticket created successfully!</h3>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={200}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Brief summary of the issue"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                            Description
                        </label>
                        <div className="mt-1 relative">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleDescriptionBlur}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Explain the details..."
                            />
                            {loadingAI && (
                                <div className="absolute right-2 bottom-2 text-xs text-indigo-600 flex items-center bg-indigo-50 px-2 py-1 rounded">
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    AI Analyzing...
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="billing">Billing</option>
                                <option value="technical">Technical</option>
                                <option value="account">Account</option>
                                <option value="general">General</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || loadingAI}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {submitting ? 'Creating...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
