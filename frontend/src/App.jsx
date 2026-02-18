import { useState } from 'react'
import TicketForm from './components/TicketForm'
import TicketList from './components/TicketList'
import StatsDashboard from './components/StatsDashboard'

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleTicketCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-white text-xl font-bold tracking-tight">TicketIQ</span>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <span className="text-indigo-100 px-3 py-2 rounded-md text-sm font-medium">Dashboard</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Top Section: Stats and New Ticket Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-2">
                            <StatsDashboard refreshTrigger={refreshTrigger} />
                        </section>
                        <section className="lg:col-span-1">
                            <TicketForm onTicketCreated={handleTicketCreated} />
                        </section>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Recent Tickets
                            </h2>
                        </div>
                        <TicketList refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App
