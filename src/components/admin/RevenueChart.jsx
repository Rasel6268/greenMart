// components/dashboard/RevenueChart.jsx
"use client";
import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const RevenueChart = ({ ordersData = [] }) => {
  const [timeRange, setTimeRange] = useState('7d');

  // Generate chart data from orders
  const generateChartData = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dateString = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });

      // Filter orders for this day
      const dayOrders = ordersData.filter(order => {
        const orderDate = new Date(order.createdAt || order.date);
        return orderDate.toDateString() === date.toDateString();
      });

      const revenue = dayOrders.reduce((sum, order) => {
        const amount = parseFloat(order.total || order.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      const orders = dayOrders.length;

      data.push({
        name: dateString,
        revenue: Math.round(revenue),
        orders: orders,
      });
    }

    return data;
  };

  const chartData = generateChartData();
  const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0);
  const avgDailyRevenue = Math.round(totalRevenue / chartData.length);

  return (
    <div className="h-80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          </div>
          <p className="text-gray-600 text-sm">Daily revenue and order trends</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Avg. Daily</p>
          <p className="text-2xl font-bold text-gray-900">${avgDailyRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenue']}
              labelStyle={{ color: '#374151', fontWeight: '600' }}
              contentStyle={{ 
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, fill: '#059669' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;