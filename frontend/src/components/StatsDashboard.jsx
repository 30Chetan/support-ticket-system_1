import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const StatsDashboard = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets/stats/`);
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-pulse text-gray-500">Loading statistics...</div>
    </div>
  );

  if (!stats) return null;

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Overview</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Total Tickets</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.total_tickets}</dd>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Open Tickets</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">{stats.open_tickets}</dd>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Avg Tickets / Day</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.avg_tickets_per_day}</dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-4 border-b border-gray-100 sm:px-6">
            <h4 className="text-base font-semibold leading-6 text-gray-900">Priority Breakdown</h4>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-4">
              {Object.entries(stats.priority_breakdown).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-block h-2 w-2 rounded-full mr-2 
                                            ${key === 'critical' ? 'bg-red-500' :
                        key === 'high' ? 'bg-orange-400' :
                          key === 'medium' ? 'bg-green-400' : 'bg-blue-400'}`}>
                    </span>
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-4 border-b border-gray-100 sm:px-6">
            <h4 className="text-base font-semibold leading-6 text-gray-900">Category Breakdown</h4>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-4">
              {Object.entries(stats.category_breakdown).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{key}</span>
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
