import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import TicketForm from './components/TicketForm'
import './App.css'

function App() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const fetchTickets = useCallback(() => {
        setLoading(true);
        axios.get(`${apiUrl}/api/tickets/`)
            .then(response => {
                setTickets(response.data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error fetching tickets:", err)
                setError("Failed to load tickets")
                setLoading(false)
            })
    }, [apiUrl]);

    useEffect(() => {
        fetchTickets()
    }, [fetchTickets])

    return (
        <div className="container">
            <h1>Support Ticket System</h1>

            <TicketForm onTicketCreated={fetchTickets} />

            {loading && <p>Loading tickets...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="ticket-list">
                    {tickets.length === 0 ? (
                        <p>No tickets found.</p>
                    ) : (
                        tickets.map(ticket => (
                            <div key={ticket.id} className="ticket-card">
                                <h3>{ticket.title}</h3>
                                <p>{ticket.description}</p>
                                <div className="meta">
                                    <span className={`status ${ticket.status}`}>{ticket.status}</span>
                                    <span className="date">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default App
