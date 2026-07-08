import React, { useState, useEffect } from 'react';
import { Herb } from '../types';
import { SearchIcon, LoaderIcon } from '../components/ui/icons';
import { api } from '../services/api';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);

  // 初始加载所有数据
  useEffect(() => {
    loadHerbs('');
  }, []);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      loadHerbs(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadHerbs = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await api.searchHerbs(query);
      setHerbs(data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-tcm-900 mb-6">本草检索</h2>
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="输入药名、功效或拼音搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-tcm-200 focus:ring-2 focus:ring-tcm-500 outline-none shadow-sm transition-all"
          />
          {isLoading ? (
             <LoaderIcon className="absolute left-4 top-3.5 w-5 h-5 text-tcm-500 animate-spin" />
          ) : (
             <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {herbs.map(herb => (
          <div 
            key={herb.id}
            onClick={() => setSelectedHerb(herb)}
            className="bg-white rounded-xl shadow-sm border border-tcm-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={herb.imageUrl} 
                alt={herb.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold text-tcm-900">{herb.name}</h3>
                <span className="text-xs bg-tcm-100 text-tcm-800 px-2 py-1 rounded-full">{herb.category}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3 italic">{herb.pinyin}</p>
              <p className="text-tcm-700 text-sm line-clamp-2">{herb.efficacy}</p>
            </div>
          </div>
        ))}

        {!isLoading && herbs.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p>未找到相关中药，请尝试其他关键词。</p>
          </div>
        )}
      </div>

      {/* Modal Detail View */}
      {selectedHerb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedHerb(null)}>
          <div className="bg-paper rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/3 h-64 md:h-auto bg-gray-100">
               <img src={selectedHerb.imageUrl} alt={selectedHerb.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h2 className="text-3xl font-serif font-bold text-tcm-900">{selectedHerb.name}</h2>
                   <p className="text-tcm-500 italic">{selectedHerb.pinyin}</p>
                </div>
                <button 
                  onClick={() => setSelectedHerb(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                   <span className="bg-tcm-800 text-white text-xs px-2 py-1 rounded">{selectedHerb.category}</span>
                   <span className="bg-tcm-100 text-tcm-800 text-xs px-2 py-1 rounded">性味：{selectedHerb.nature}</span>
                </div>

                <div className="border-t border-tcm-200 pt-4">
                   <h4 className="font-bold text-tcm-800 mb-1">【归经】</h4>
                   <p className="text-tcm-600 text-sm">{selectedHerb.channels.join('、')}</p>
                </div>

                <div>
                   <h4 className="font-bold text-tcm-800 mb-1">【功效】</h4>
                   <p className="text-tcm-600 text-sm">{selectedHerb.efficacy}</p>
                </div>

                <div>
                   <h4 className="font-bold text-tcm-800 mb-1">【主治与描述】</h4>
                   <p className="text-tcm-600 text-sm leading-relaxed">{selectedHerb.description}</p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                   <h4 className="font-bold text-yellow-800 mb-1 text-sm">【注意禁忌】</h4>
                   <p className="text-yellow-700 text-xs">{selectedHerb.contraindications}</p>
                </div>
                
                 <div>
                   <h4 className="font-bold text-tcm-800 mb-1">【用法用量】</h4>
                   <p className="text-tcm-600 text-sm">{selectedHerb.usage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;