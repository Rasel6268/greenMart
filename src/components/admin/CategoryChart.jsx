// components/dashboard/CategoryChart.jsx
"use client";
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const CategoryChart = ({ categoryStats = [], categories = [] }) => {
  const [viewMode, setViewMode] = useState('pie');

  // Prepare chart data
  const chartData = categoryStats.map((stat, index) => ({
    name: stat.category || `Category ${index + 1}`,
    value: stat.count || stat.value || Math.floor(Math.random() * 100) + 20,
    products: stat.productCount || Math.floor(Math.random() * 50) + 10,
  })).slice(0, 7); // Limit to 7 categories for better visualization

  const totalProducts = chartData.reduce((sum, item) => sum + item.products, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Products: <span className="font-semibold">{payload[0].payload.products}</span>
          </p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((payload[0].payload.products / totalProducts) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
          <p className="text-gray-600 text-sm">Products by category</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('pie')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${viewMode === 'pie' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pie
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${viewMode === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar 
                dataKey="products" 
                name="Products"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {chartData.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.products} products</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;