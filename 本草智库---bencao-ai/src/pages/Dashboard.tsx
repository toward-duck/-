import React, { useEffect, useState } from 'react';
import { PageView, User, ConstitutionType, Herb } from '../types';
import { LeafIcon, MessageCircleIcon, SearchIcon, ActivityIcon } from '../components/ui/icons';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (page: PageView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [lastTestResult, setLastTestResult] = useState<ConstitutionType | null>(null);
  const [dailyHerb, setDailyHerb] = useState<Herb | null>(null);

  useEffect(() => {
    const fetchLastResult = async () => {
      try {
        const data = await api.getLastTestResult(user.username);
        if (data && data.result) {
          setLastTestResult(data.result);
        }
      } catch (e) {
        console.error("Failed to fetch test result", e);
      }
    };

    const fetchDailyHerb = async () => {
      try {
        const herb = await api.getDailyHerb();
        setDailyHerb(herb);
      } catch (e) {
        console.error("Failed to fetch daily herb", e);
      }
    };

    fetchLastResult();
    fetchDailyHerb();
  }, [user.username]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-4">
        <h1 className="text-4xl font-serif font-bold text-tcm-900 mb-2">欢迎回来，{user.username} 👋</h1>
        <p className="text-tcm-600">本草智库为您提供全方位的中医药健康服务。</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('search')}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-tcm-100 cursor-pointer overflow-hidden flex flex-col justify-between h-64"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-tcm-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-tcm-100 rounded-lg flex items-center justify-center text-tcm-700 mb-4 group-hover:bg-tcm-700 group-hover:text-white transition-colors">
              <SearchIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-tcm-900 mb-2">本草检索</h3>
            <p className="text-tcm-600 text-sm leading-relaxed">
              查询中药材的性味归经、功效禁忌及现代药理研究。
            </p>
          </div>
          <span className="text-tcm-700 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">立即查阅 &rarr;</span>
        </div>

         <div onClick={() => onNavigate('test')} className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-tcm-100 cursor-pointer overflow-hidden flex flex-col justify-between h-64">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-700 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors"><ActivityIcon className="w-5 h-5" /></div>
            <h3 className="text-xl font-serif font-bold text-tcm-900 mb-2">体质检测</h3>
            <p className="text-tcm-600 text-sm leading-relaxed">{lastTestResult ? `您上次的检测结果为：${lastTestResult}。点击查看详情。` : "九种体质辨识。了解您的身体特质。"}</p>
          </div>
          <div className="flex items-center justify-between">
             <span className="text-orange-700 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">{lastTestResult ? "查看详情 &rarr;" : "开始检测 &rarr;"}</span>
             {lastTestResult && (<span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{lastTestResult}</span>)}
          </div>
        </div>

        <div onClick={() => onNavigate('recommendation')} className="group relative bg-gradient-to-br from-tcm-800 to-tcm-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer text-white overflow-hidden flex flex-col justify-between h-64">
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full -mr-6 -mb-6 pointer-events-none"></div>
           <div className="relative z-10">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white mb-4 backdrop-blur-sm"><MessageCircleIcon className="w-5 h-5" /></div>
            <h3 className="text-xl font-serif font-bold mb-2">智能问诊</h3>
            <p className="text-tcm-100 text-sm leading-relaxed">基于 AI 助手。描述症状，获得个性化的中医健康建议。</p>
          </div>
          <span className="text-white text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">咨询 AI &rarr;</span>
        </div>
      </div>

      {/* 动态的每日一草模块 */}
      <div className="bg-tcm-50 rounded-2xl p-8 border border-tcm-200">
        <h3 className="text-xl font-serif font-bold text-tcm-900 mb-4 flex items-center gap-2">
          <LeafIcon className="w-5 h-5" />
          每日一草
        </h3>
        {dailyHerb ? (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img 
              src={dailyHerb.imageUrl || "https://picsum.photos/id/106/150/150"} 
              alt={dailyHerb.name} 
              className="w-full md:w-32 h-32 object-cover rounded-lg shadow-md" 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/id/106/150/150"; }}
            />
            <div>
              <h4 className="text-lg font-bold text-tcm-800 mb-2">{dailyHerb.name} {dailyHerb.pinyin && `(${dailyHerb.pinyin})`}</h4>
              <div className="text-tcm-600 text-sm leading-relaxed mb-2">
                <span className="font-semibold text-tcm-800">【归经】</span>{dailyHerb.channels && dailyHerb.channels.length > 0 ? dailyHerb.channels.join('、') : '暂无'}<br/>
                <span className="font-semibold text-tcm-800">【性味】</span>{dailyHerb.nature || '暂无'}<br/>
                <span className="font-semibold text-tcm-800">【功效】</span>{dailyHerb.efficacy || '暂无'}
              </div>
              <p className="text-gray-500 text-xs italic">
                {dailyHerb.description && `"${dailyHerb.description}"`} {dailyHerb.category && `属于${dailyHerb.category}。`} 用法：{dailyHerb.usage || '暂无'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-tcm-500 bg-white rounded-xl border border-dashed border-tcm-300">
            <p>药草数据库目前为空，请在数据库的 herbs 表中录入数据。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;