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
            // We don't show an error to the user for this, just fail silently
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await axios.post(`${API_URL}/api/tickets/`, formData);

            // Reset form
            setFormData({
                title: '',
                description: '',
                category: 'general',
                priority: 'medium'
            });

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
        <div className="ticket-form-container">
            <h2>Create New Ticket</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={200}
                        required
                        placeholder="Brief summary of the issue"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleDescriptionBlur}
                        required
                        placeholder="Detailed explanation..."
                        rows={4}
                    />
                    {loadingAI && <span className="ai-loading">🤖 AI is analyzing...</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="billing">Billing</option>
                            <option value="technical">Technical</option>
                            <option value="account">Account</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <button type="submit" disabled={submitting || loadingAI} className="submit-btn">
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>

            <style>{`
        .ticket-form-container {
          background: #333;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
          text-align: left;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #555;
          background: #222;
          color: white;
          font-size: 1rem;
          box-sizing: border-box; /* Fix width overflow */
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-row .form-group {
          flex: 1;
        }
        .submit-btn {
          background: #646cff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          width: 100%;
        }
        .submit-btn:disabled {
          background: #4a4a4a;
          cursor: not-allowed;
        }
        .ai-loading {
          font-size: 0.8rem;
          color: #646cff;
          margin-top: 0.25rem;
          display: block;
          animation: pulse 1.5s infinite;
        }
        .error-message {
          background: rgba(255, 0, 0, 0.1);
          color: #ff6b6b;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
};

export default TicketForm;
