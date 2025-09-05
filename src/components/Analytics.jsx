'use client';

import { useState, useEffect } from 'react';
import { FaChartLine, FaMapMarkerAlt, FaUsers, FaGlobe, FaClock, FaTrendingUp, FaDownload } from 'react-icons/fa';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalConversions: 0,
    todayConversions: 0,
    activeUsers: 0,
    avgResponseTime: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setStats({
        totalConversions: 1247893,
        todayConversions: 2847,
        activeUsers: 156,
        avgResponseTime: 0.23,
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { name: 'Mon', conversions: 1200, users: 45 },
    { name: 'Tue', conversions: 1900, users: 67 },
    { name: 'Wed', conversions: 1600, users: 52 },
    { name: 'Thu', conversions: 2100, users: 78 },
    { name: 'Fri', conversions: 2400, users: 89 },
    { name: 'Sat', conversions: 1800, users: 61 },
    { name: 'Sun', conversions: 1500, users: 48 },
  ];

  const topRegions = [
    { country: 'India', conversions: 45231, percentage: 36.2 },
    { country: 'United States', conversions: 28947, percentage: 23.2 },
    { country: 'United Kingdom', conversions: 15632, percentage: 12.5 },
    { country: 'Germany', conversions: 12458, percentage: 10.0 },
    { country: 'Others', conversions: 22625, percentage: 18.1 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor your DigiPin usage and performance metrics</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          <FaDownload className="text-sm" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt className="text-blue-600 text-lg" />
            </div>
            <div className="text-green-500 text-sm font-medium flex items-center space-x-1">
              <FaTrendingUp className="text-xs" />
              <span>+12.5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalConversions.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Total Conversions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-green-600 text-lg" />
            </div>
            <div className="text-green-500 text-sm font-medium flex items-center space-x-1">
              <FaTrendingUp className="text-xs" />
              <span>+8.2%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.todayConversions.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Today's Conversions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaUsers className="text-purple-600 text-lg" />
            </div>
            <div className="text-green-500 text-sm font-medium flex items-center space-x-1">
              <FaTrendingUp className="text-xs" />
              <span>+5.7%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.activeUsers}
          </h3>
          <p className="text-gray-600 text-sm">Active Users</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FaClock className="text-orange-600 text-lg" />
            </div>
            <div className="text-green-500 text-sm font-medium flex items-center space-x-1">
              <FaTrendingUp className="text-xs" />
              <span>-15.3%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.avgResponseTime}s
          </h3>
          <p className="text-gray-600 text-sm">Avg Response Time</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Usage</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Conversions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Users</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {chartData.map((day, index) => (
              <div key={day.name} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-gray-600 font-medium">{day.name}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(day.conversions / 2400) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {day.conversions.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Regions</h3>
            <FaGlobe className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topRegions.map((region, index) => (
              <div key={region.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{region.country}</div>
                    <div className="text-sm text-gray-500">{region.conversions.toLocaleString()} conversions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{region.percentage}%</div>
                  <div className="w-16 bg-gray-100 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Batch conversion completed', details: '247 coordinates processed', time: '2 minutes ago', status: 'success' },
            { action: 'API rate limit reached', details: 'Temporary throttling applied', time: '15 minutes ago', status: 'warning' },
            { action: 'New user registration', details: 'user@example.com joined', time: '1 hour ago', status: 'info' },
            { action: 'System maintenance', details: 'Scheduled maintenance completed', time: '3 hours ago', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{activity.action}</div>
                <div className="text-sm text-gray-600">{activity.details}</div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;