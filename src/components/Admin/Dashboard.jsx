import { useEffect, useState } from 'react';
import Scene from '../Background/Scene';
import { motion } from 'framer-motion';
import { formatDate, formatDuration } from '../../utils/formatters';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Login from './Login';
import { checkAuth, logout, authHeaders } from '../../utils/auth';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  const [visitData, setVisitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  
  useEffect(() => {
    fetchVisitData();
  }, []);

  const fetchVisitData = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE}/visits`, {
        headers: { ...authHeaders() },
      });
      if (response.status === 401) {
        logout();
        setIsAuthenticated(false);
        return;
      }
      const data = await response.json();
      setVisitData(data);
    } catch (error) {
      console.error('Error fetching visit data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filteredData = visitData.filter(visit => {
    const matchesSearch = 
      visit.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.location.toLowerCase().includes(searchTerm.toLowerCase());

    const visitDate = new Date(visit.timestamp);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return matchesSearch && 
          visitDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && visitDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return matchesSearch && visitDate >= monthAgo;
      default:
        return matchesSearch;
    }
  });

  // 处理图表数据
  const chartData = {
    labels: filteredData
      .slice(-7)
      .map(visit => formatDate(visit.timestamp).split(' ')[0]),
    datasets: [
      {
        label: '访问次数',
        data: filteredData
          .slice(-7)
          .map((_, index, array) => array.length - index),
        borderColor: 'rgb(147, 51, 234)',
        tension: 0.3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: '最近7天访问趋势',
        color: 'white'
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' }
      },
      x: {
        ticks: { color: 'white' }
      }
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen relative">
      <Scene />
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-md rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">访问统计</h1>
              <button
                onClick={() => {
                  logout();
                  setIsAuthenticated(false);
                }}
                className="px-4 py-2 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg transition-colors"
              >
                退出登录
              </button>
            </div>

            {/* 图表区域 */}
            <div className="mb-8 bg-white/5 p-4 rounded-lg">
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* 搜索和过滤控件 */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input
                type="text"
                placeholder="搜索 IP 或地址..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-purple-500"
              />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-500"
              >
                <option value="all">所有时间</option>
                <option value="today">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
              </select>
            </div>

            {loading ? (
              <div className="text-white">加载中...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-purple-400/30">
                      <th className="px-4 py-3 text-left">IP地址</th>
                      <th className="px-4 py-3 text-left">地理位置</th>
                      <th className="px-4 py-3 text-left">访问时间</th>
                      <th className="px-4 py-3 text-left">访问时长</th>
                      <th className="px-4 py-3 text-left">访问页面</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((visit, index) => (
                      <tr 
                        key={index}
                        className="border-b border-purple-400/10 hover:bg-purple-400/10 transition-colors"
                      >
                        <td className="px-4 py-3">{visit.ip}</td>
                        <td className="px-4 py-3">{visit.location}</td>
                        <td className="px-4 py-3">{formatDate(visit.timestamp)}</td>
                        <td className="px-4 py-3">{formatDuration(visit.duration)}</td>
                        <td className="px-4 py-3">{visit.path || '/'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 