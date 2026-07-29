import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const API_URL = 'http://localhost:8000';
const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [analyticsRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/api/v1/admin/analytics/overview`, { headers }),
          axios.get(`${API_URL}/api/v1/admin/dashboard/stats`, { headers })
        ]);
        setAnalytics(analyticsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-lg"><Users size={20} className="text-white" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-bold">{stats?.total_users || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-3 rounded-lg"><Activity size={20} className="text-white" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Attempts</p>
              <p className="text-xl font-bold">{stats?.total_attempts || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-3 rounded-lg"><BarChart3 size={20} className="text-white" /></div>
            <div>
              <p className="text-sm text-gray-500">Avg Score</p>
              <p className="text-xl font-bold">{stats?.avg_score || 0}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-3 rounded-lg"><TrendingUp size={20} className="text-white" /></div>
            <div>
              <p className="text-sm text-gray-500">Resources</p>
              <p className="text-xl font-bold">{stats?.total_resources || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Growth (30 Days)</h2>
          {analytics?.user_growth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.user_growth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>

        {/* Attempts Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Reading Attempts (30 Days)</h2>
          {analytics?.attempts_growth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.attempts_growth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score by Difficulty */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Avg. Score by Difficulty</h2>
          {analytics?.score_by_difficulty?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analytics.score_by_difficulty} cx="50%" cy="50%"
                  labelLine={false} label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100} fill="#8884d8" dataKey="avg_score">
                  {analytics.score_by_difficulty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Role Distribution</h2>
          {stats?.role_counts && Object.keys(stats.role_counts).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={Object.entries(stats.role_counts).map(([name, value]) => ({ name, value }))}
                  cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}>
                  {Object.entries(stats.role_counts).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
