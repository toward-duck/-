import React, { useState } from 'react';
import { User } from '../types';
import { LeafIcon, LoaderIcon } from '../components/ui/icons';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 调用我们封装的 API 服务（会自动尝试连接 Node.js 后端）
      const user = await api.login(username, password);
      onLogin(user);
    } catch (err) {
      setError('登录失败：可能是密码错误，或服务器未启动');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tcm-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-tcm-100">
        <div className="bg-tcm-800 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Decorative pattern could go here */}
          </div>
          <div className="inline-block p-3 rounded-full bg-tcm-700 mb-4 border border-tcm-600">
            <LeafIcon className="w-8 h-8 text-tcm-100" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">本草智库</h2>
          <p className="text-tcm-200 text-sm">探索中医智慧，守护生命健康</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-tcm-800 mb-1">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-tcm-200 focus:ring-2 focus:ring-tcm-500 focus:border-transparent outline-none transition-all bg-tcm-50"
                placeholder="请输入用户名 (新用户将自动注册)"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-tcm-800 mb-1">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-tcm-200 focus:ring-2 focus:ring-tcm-500 focus:border-transparent outline-none transition-all bg-tcm-50"
                placeholder="请输入密码"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-tcm-700 hover:bg-tcm-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                  <span>处理中...</span>
                </>
              ) : (
                <span>登录 / 注册</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            <p>本系统内容仅供参考，如若身体有恙请尽早就医</p>
            <p className="mt-1 opacity-75 transform scale-90">
              (切记本系统内容仅供科普使用)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;