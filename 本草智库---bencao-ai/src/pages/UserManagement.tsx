import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { LoaderIcon, UserIcon } from '../components/ui/icons';

interface UserManagementProps {
  currentUser: User;
}

type TabType = 'users' | 'herbs';

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  
  // --- 用户管理状态 ---
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userError, setUserError] = useState('');

  // --- 药草录入状态 ---
  const initialHerbForm = {
    name: '',
    pinyin: '',
    category: '',
    nature: '',
    channels: '',
    description: '',
    efficacy: '',
    usage: '',
    contraindications: '',
    imageUrl: ''
  };
  const [herbForm, setHerbForm] = useState(initialHerbForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // 加载用户列表
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUserError('无法获取用户列表');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  // 删除用户
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('确定要删除该用户吗？此操作不可恢复。')) return;
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('删除失败');
    }
  };

  // 处理药草表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHerbForm(prev => ({ ...prev, [name]: value }));
  };

  // 提交药草数据
  const handleAddHerb = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // 将逗号分隔的字符串转换为数组发送给后端
      const payload = {
        ...herbForm,
        channels: herbForm.channels.split(/[,，]/).map(c => c.trim()).filter(Boolean)
      };

      await api.addHerb(payload);
      
      setSubmitMessage({ type: 'success', text: `✅ 药草“${herbForm.name}”已成功录入数据库！` });
      setHerbForm(initialHerbForm); // 清空表单
      
      // 3秒后清除成功提示
      setTimeout(() => setSubmitMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setSubmitMessage({ type: 'error', text: '❌ 录入失败，请检查网络或控制台报错。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-tcm-900 mb-2">后台管理中心</h1>
          <p className="text-tcm-600">管理平台注册用户及录入本草数据。</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium border border-orange-200">
          管理员模式
        </div>
      </header>

      {/* 标签页切换栏 */}
      <div className="flex gap-4 mb-6 border-b border-tcm-200 pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-lg font-medium rounded-t-xl transition-colors ${
            activeTab === 'users' 
              ? 'bg-tcm-800 text-white shadow-md' 
              : 'text-tcm-600 hover:bg-tcm-100 hover:text-tcm-900'
          }`}
        >
          👤 用户管理
        </button>
        <button
          onClick={() => setActiveTab('herbs')}
          className={`px-6 py-3 text-lg font-medium rounded-t-xl transition-colors ${
            activeTab === 'herbs' 
              ? 'bg-tcm-800 text-white shadow-md' 
              : 'text-tcm-600 hover:bg-tcm-100 hover:text-tcm-900'
          }`}
        >
          🌿 录入药草
        </button>
      </div>

      {/* --- 面板 1: 用户管理 --- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-tcm-100 overflow-hidden animate-fade-in">
          {isLoadingUsers ? (
            <div className="p-12 flex justify-center items-center text-tcm-500 gap-2">
              <LoaderIcon className="animate-spin w-5 h-5" />
              <span>加载用户数据...</span>
            </div>
          ) : userError ? (
            <div className="p-12 text-center text-red-500">{userError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-tcm-50 border-b border-tcm-200 text-tcm-700 text-sm uppercase tracking-wider">
                    <th className="p-6 font-medium">用户信息</th>
                    <th className="p-6 font-medium">角色</th>
                    <th className="p-6 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tcm-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-tcm-100 flex items-center justify-center text-tcm-600">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-tcm-900">{user.username}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.role === 'admin' ? '管理员' : '普通用户'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === currentUser.id}
                          className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                            user.id === currentUser.id
                              ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'
                              : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {user.id === currentUser.id ? '当前用户' : '删除'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                     <tr><td colSpan={3} className="p-8 text-center text-gray-400">暂无用户数据</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- 面板 2: 药草录入表单 --- */}
      {activeTab === 'herbs' && (
        <div className="bg-white rounded-2xl shadow-sm border border-tcm-100 p-8 animate-fade-in">
          <h2 className="text-xl font-bold text-tcm-900 mb-6 border-b border-tcm-100 pb-4">
            新增本草检索数据
          </h2>
          
          <form onSubmit={handleAddHerb} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-tcm-700 mb-2">药材名称 (必填) *</label>
                <input required type="text" name="name" value={herbForm.name} onChange={handleInputChange} placeholder="例如：人参" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tcm-700 mb-2">拼音全拼</label>
                <input type="text" name="pinyin" value={herbForm.pinyin} onChange={handleInputChange} placeholder="例如：Ren Shen" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tcm-700 mb-2">所属分类</label>
                <input type="text" name="category" value={herbForm.category} onChange={handleInputChange} placeholder="例如：补气药" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-tcm-700 mb-2">性味</label>
                <input type="text" name="nature" value={herbForm.nature} onChange={handleInputChange} placeholder="例如：甘、微苦，微温" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tcm-700 mb-2">归经 (多个请用逗号分隔)</label>
              <input type="text" name="channels" value={herbForm.channels} onChange={handleInputChange} placeholder="例如：脾, 肺, 心" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-tcm-700 mb-2">图片链接 (URL)</label>
              <input type="text" name="imageUrl" value={herbForm.imageUrl} onChange={handleInputChange} placeholder="例如：https://example.com/renshen.jpg (支持外部图床链接)" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-tcm-700 mb-2">功效</label>
                 <textarea name="efficacy" value={herbForm.efficacy} onChange={handleInputChange} rows={3} placeholder="例如：大补元气，复脉固脱..." className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none resize-none"></textarea>
              </div>
              <div>
                 <label className="block text-sm font-medium text-tcm-700 mb-2">用法用量</label>
                 <textarea name="usage" value={herbForm.usage} onChange={handleInputChange} rows={3} placeholder="例如：3~9g，另煎兑服..." className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none resize-none"></textarea>
              </div>
              <div>
                 <label className="block text-sm font-medium text-tcm-700 mb-2">简述 / 介绍</label>
                 <textarea name="description" value={herbForm.description} onChange={handleInputChange} rows={3} placeholder="简单的背景介绍" className="w-full px-4 py-2.5 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none resize-none"></textarea>
              </div>
              <div>
                 <label className="block text-sm font-medium text-yellow-700 mb-2">使用禁忌</label>
                 <textarea name="contraindications" value={herbForm.contraindications} onChange={handleInputChange} rows={3} placeholder="例如：实证、热证忌服..." className="w-full px-4 py-2.5 rounded-xl border border-yellow-200 bg-yellow-50 focus:ring-2 focus:ring-yellow-500 outline-none resize-none"></textarea>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-tcm-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-tcm-800 text-white font-bold rounded-xl hover:bg-tcm-900 transition-colors disabled:bg-gray-400 flex items-center gap-2"
              >
                {isSubmitting ? <LoaderIcon className="animate-spin w-5 h-5" /> : null}
                {isSubmitting ? '保存中...' : '提交录入'}
              </button>
              
              {submitMessage.text && (
                <span className={`font-medium ${submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {submitMessage.text}
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;