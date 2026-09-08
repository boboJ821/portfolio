import { useState } from 'react';
import Scene from '../Background/Scene';
import { motion } from 'framer-motion';
import { login } from '../../utils/auth';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(password);
    setLoading(false);
    if (ok) {
      onLogin();
    } else {
      setError('密码错误');
    }
  };

  return (
    <div className="min-h-screen relative">
      <Scene />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-md rounded-lg p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-white mb-6">管理员登录</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入管理员密码"
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-purple-500"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 