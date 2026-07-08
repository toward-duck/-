
import React from 'react';
import { PageView, User } from '../types';
import { BookIcon, LeafIcon, LogOutIcon, UserIcon, ActivityIcon, UsersIcon, MessageCircleIcon } from './ui/icons';

interface NavbarProps {
  user: User | null;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentPage, onNavigate, onLogout }) => {
  if (!user) return null;

  const navItems: { id: PageView; label: string; icon: React.FC<any> }[] = [
    { id: 'dashboard', label: '首页', icon: BookIcon },
    { id: 'search', label: '本草检索', icon: LeafIcon },
    { id: 'test', label: '体质检测', icon: ActivityIcon },
    { id: 'recommendation', label: '智能问诊', icon: MessageCircleIcon },
  ];

  // 仅对管理员显示用户管理
  if (user.role === 'admin') {
    navItems.push({ id: 'users', label: '用户管理', icon: UsersIcon });
  }

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-tcm-800 text-tcm-50 shadow-xl flex flex-col z-50">
      <div className="p-6 border-b border-tcm-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-tcm-100 flex items-center justify-center text-tcm-800 font-bold text-xl">
          本
        </div>
        <div>
          <h1 className="text-xl font-serif font-bold tracking-wide">本草智库</h1>
          <p className="text-xs text-tcm-300">中医药知识科普平台</p>
        </div>
      </div>

      <div className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-tcm-600 text-white shadow-md'
                    : 'text-tcm-200 hover:bg-tcm-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium tracking-wide">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-tcm-700">
        <div className="flex items-center gap-3 px-4 py-3 bg-tcm-900/50 rounded-lg mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-orange-500' : 'bg-tcm-500'}`}>
             <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user.username}</p>
            <p className="text-xs text-tcm-400 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-sm text-tcm-300 hover:text-red-300 transition-colors py-2"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>退出登录</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
