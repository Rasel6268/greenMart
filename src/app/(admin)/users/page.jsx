"use client"
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
  Users,
  CheckCircle,
  XCircle,
  Star,
  Download,
  Building,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const CustomersTable = () => {
  const [activeTab, setActiveTab] = useState('regular');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const regularCustomers = [
    {
      id: 'CUS-1001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      status: 'active',
      orders: 12,
      totalSpent: '$2,450.00',
      lastOrder: 'Jan 15, 2024',
      joinDate: 'Mar 12, 2023',
      type: 'regular'
    },
    {
      id: 'CUS-1002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, USA',
      status: 'active',
      orders: 8,
      totalSpent: '$1,890.50',
      lastOrder: 'Jan 14, 2024',
      joinDate: 'May 20, 2023',
      type: 'regular'
    },
    {
      id: 'CUS-1003',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 456-7890',
      location: 'San Francisco, USA',
      status: 'inactive',
      orders: 3,
      totalSpent: '$542.75',
      lastOrder: 'Dec 20, 2023',
      joinDate: 'Aug 15, 2023',
      type: 'regular'
    },
    {
      id: 'CUS-1004',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Chicago, USA',
      status: 'active',
      orders: 15,
      totalSpent: '$3,245.80',
      lastOrder: 'Jan 16, 2024',
      joinDate: 'Feb 8, 2023',
      type: 'regular'
    },
    {
      id: 'CUS-1005',
      name: 'Robert Wilson',
      email: 'rob.wilson@email.com',
      phone: '+1 (555) 876-5432',
      location: 'Miami, USA',
      status: 'active',
      orders: 6,
      totalSpent: '$890.25',
      lastOrder: 'Jan 13, 2024',
      joinDate: 'Nov 5, 2023',
      type: 'regular'
    }
  ];
  const {data ,isLoading,error} = useQuery({
    queryKey:['wholeSale'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wholesales`)
      return res.data.data
    }
  })
   


  const wholesaleCustomers = [
    {
      id: 'WCUS-2001',
      company: 'Global Tech Solutions',
      contact: 'David Miller',
      email: 'david.m@globaltech.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, USA',
      status: 'active',
      orders: 45,
      totalSpent: '$45,670.00',
      creditLimit: '$50,000',
      paymentTerms: 'Net 30',
      lastOrder: 'Jan 16, 2024',
      joinDate: 'Jan 15, 2022',
      type: 'wholesale'
    },
    {
      id: 'WCUS-2002',
      company: 'Prime Distributors Inc',
      contact: 'Lisa Brown',
      email: 'lisa.b@primedist.com',
      phone: '+1 (555) 765-4321',
      location: 'Seattle, USA',
      status: 'active',
      orders: 32,
      totalSpent: '$28,950.75',
      creditLimit: '$35,000',
      paymentTerms: 'Net 45',
      lastOrder: 'Jan 15, 2024',
      joinDate: 'Mar 20, 2022',
      type: 'wholesale'
    },
    {
      id: 'WCUS-2003',
      company: 'Metro Retail Group',
      contact: 'Jennifer Lee',
      email: 'j.lee@metrogroup.com',
      phone: '+1 (555) 543-2167',
      location: 'Boston, USA',
      status: 'pending',
      orders: 2,
      totalSpent: '$4,250.00',
      creditLimit: '$25,000',
      paymentTerms: 'Net 15',
      lastOrder: 'Jan 10, 2024',
      joinDate: 'Dec 1, 2023',
      type: 'wholesale'
    },
    {
      id: 'WCUS-2004',
      company: 'Elite Wholesale Co',
      contact: 'Michael Taylor',
      email: 'm.taylor@elitewholesale.com',
      phone: '+1 (555) 678-9012',
      location: 'Denver, USA',
      status: 'active',
      orders: 28,
      totalSpent: '$32,150.40',
      creditLimit: '$40,000',
      paymentTerms: 'Net 30',
      lastOrder: 'Jan 14, 2024',
      joinDate: 'Jun 10, 2022',
      type: 'wholesale'
    },
    {
      id: 'WCUS-2005',
      company: 'National Distributors',
      contact: 'Amanda Clark',
      email: 'a.clark@nationaldist.com',
      phone: '+1 (555) 890-1234',
      location: 'Atlanta, USA',
      status: 'suspended',
      orders: 18,
      totalSpent: '$15,780.25',
      creditLimit: '$30,000',
      paymentTerms: 'Net 30',
      lastOrder: 'Dec 5, 2023',
      joinDate: 'Apr 18, 2022',
      type: 'wholesale'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'inactive':
        return <XCircle size={16} className="text-red-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'suspended':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <User size={16} className="text-gray-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'pending':
        return 'Pending Approval';
      case 'suspended':
        return 'Suspended';
      default:
        return 'Unknown';
    }
  };

  const currentCustomers = activeTab === 'regular' ? regularCustomers : data;

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleAllCustomers = () => {
    setSelectedCustomers(
      selectedCustomers.length === currentCustomers.length
        ? []
        : currentCustomers.map(customer => customer.id)
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage regular and wholesale customers</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            <span>Export</span>
          </button>
          <Link
            href={`/admin/dashboard/addcustomer?type=${activeTab}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Customer</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,842</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regular Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,568</p>
              <p className="text-sm text-gray-600 mt-1">85% of total</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <User size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wholesale Customers</p>
              {/* <p className="text-2xl font-bold text-gray-900 mt-1">{totalWholeSale.toString().padStart(2,'0')}</p> */}
              <p className="text-sm text-green-600 mt-1">+15% from last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Customer Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$456.80</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Star size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('regular')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'regular'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span>Regular Customers</span>
                <span className="bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                  {regularCustomers.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('wholesale')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'wholesale'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building size={20} />
                <span>Wholesale Customers</span>
                <span className="bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                  {/* {data.length} */}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'regular' 
                      ? "Search customers by name, email, or phone..."
                      : "Search by company, contact name, or email..."
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                {activeTab === 'wholesale' && <option value="pending">Pending</option>}
                {activeTab === 'wholesale' && <option value="suspended">Suspended</option>}
              </select>
            </div>

            {/* Location Filter */}
            <div className="lg:w-48">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Locations</option>
                <option value="usa">United States</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12 py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === currentCustomers.length && currentCustomers.length > 0}
                    onChange={toggleAllCustomers}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {activeTab === 'regular' ? (
                  <>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                  </>
                ) : (
                  <>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Company</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact Person</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Credit Terms</th>
                  </>
                )}
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Orders</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Spent</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Order</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomerSelection(customer.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  
                  {activeTab === 'regular' ? (
                    <>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.location}</span>
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Building size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{customer.company}</p>
                            <p className="text-sm text-gray-500">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{customer.contact}</p>
                          <div className="flex items-center space-x-2">
                            <Mail size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {customer.paymentTerms}
                          </span>
                          <p className="text-sm text-gray-600">Limit: {customer.creditLimit}</p>
                        </div>
                      </td>
                    </>
                  )}
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(customer.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {customer.orders} orders
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{customer.totalSpent}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{customer.lastOrder}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/customers/edit/${customer.id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Export Selected
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {currentCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab === 'regular' ? 'regular' : 'wholesale'} customers found
            </h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              href={`/dashboard/customers/add?type=${activeTab}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Your First Customer</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">
                {activeTab === 'regular' ? '1,568' : '274'}
              </span> customers
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the missing Clock icon component
const Clock = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default CustomersTable;