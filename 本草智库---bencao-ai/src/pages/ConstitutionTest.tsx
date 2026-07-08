
import React, { useState, useEffect } from 'react';
import { ActivityIcon, LoaderIcon } from '../components/ui/icons';
import { ConstitutionType } from '../types';
import { api } from '../services/api';

// 简易版题目设计
interface Question {
  id: number;
  text: string;
  type: ConstitutionType;
}

const QUESTIONS: Question[] = [
  { id: 1, text: "您是否容易疲乏，气短，说话声音低弱，容易感冒？", type: '气虚质' },
  { id: 2, text: "您是否手脚发凉，怕冷，不敢吃凉东西？", type: '阳虚质' },
  { id: 3, text: "您是否手心脚心发热，口干咽燥，皮肤干燥，容易便秘？", type: '阴虚质' },
  { id: 4, text: "您是否面部皮肤油脂较多，多汗且粘，感觉身体沉重？", type: '痰湿质' },
  { id: 5, text: "您是否面垢油光，易生痤疮，口苦口臭，大便黏滞不爽？", type: '湿热质' },
  { id: 6, text: "您是否面色晦暗，皮肤粗糙，容易有瘀斑，黑眼圈明显？", type: '血瘀质' },
  { id: 7, text: "您是否神情抑郁，容易焦虑，情感脆弱，经常叹气？", type: '气郁质' },
  { id: 8, text: "您是否容易过敏（如对药物、食物、花粉等），容易打喷嚏？", type: '特禀质' },
  { id: 9, text: "您是否精力充沛，睡眠良好，性格开朗，适应能力强？", type: '平和质' },
];

const RESULTS: Record<ConstitutionType, { title: string; desc: string; advice: string }> = {
  '平和质': {
    title: '平和质',
    desc: '体形匀称健壮，面色红润，精力充沛。',
    advice: '保持良好的生活习惯，饮食有节，起居有常，劳逸结合，不要过度劳累。'
  },
  '气虚质': {
    title: '气虚质',
    desc: '肌肉松软，声音低弱，易出汗，易感冒。',
    advice: '多吃益气健脾的食物，如黄豆、白扁豆、鸡肉等。避免剧烈运动，宜进行柔缓的运动，如散步、太极拳。'
  },
  '阳虚质': {
    title: '阳虚质',
    desc: '肌肉松软，手脚发凉，精神不振，性格多沉静、内向。',
    advice: '可多吃甘温益气的食物，如羊肉、韭菜、生姜等。少吃生冷寒凉食物。注意保暖。'
  },
  '阴虚质': {
    title: '阴虚质',
    desc: '体形偏瘦，口燥咽干，手足心热，性情急躁，外向好动。',
    advice: '多吃甘凉滋润的食物，如鸭肉、百合、梨、银耳等。少吃辛辣燥烈之品。'
  },
  '痰湿质': {
    title: '痰湿质',
    desc: '体形肥胖，腹部肥满松软，面部皮肤油脂较多。',
    advice: '饮食清淡，少食肥肉及甜、黏、油腻的食物。可多食冬瓜、海带、荷叶。加强体育锻炼。'
  },
  '湿热质': {
    title: '湿热质',
    desc: '面垢油光，易生痤疮，口苦口臭，性格多急躁易怒。',
    advice: '饮食以清淡为主，多吃甘寒、甘平的食物，如绿豆、空心菜、芹菜、黄瓜。戒烟酒。'
  },
  '血瘀质': {
    title: '血瘀质',
    desc: '肤色晦暗，色素沉着，容易出现瘀斑，口唇黯淡。',
    advice: '可多食黑豆、海藻、海带、紫菜、萝卜、山楂等具有活血、散结、行气、疏肝解郁作用的食物。'
  },
  '气郁质': {
    title: '气郁质',
    desc: '神情抑郁，情感脆弱，烦闷不乐。',
    advice: '多吃小麦、海带、海藻、萝卜、金橘、山楂等具有行气、解郁、消食、醒神作用的食物。调节心情。'
  },
  '特禀质': {
    title: '特禀质',
    desc: '过敏体质，容易对药物、食物、花粉等过敏。',
    advice: '饮食清淡、均衡，粗细搭配适当，荤素配伍合理。少吃荞麦、蚕豆、白扁豆、牛肉、鹅肉、鲤鱼、虾蟹等发物。'
  },
};

const ConstitutionTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<ConstitutionType[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleAnswer = (isYes: boolean) => {
    if (isYes) {
      setAnswers(prev => [...prev, QUESTIONS[currentStep].type]);
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTest(isYes ? [...answers, QUESTIONS[currentStep].type] : answers);
    }
  };

  const getDominantConstitution = (finalAnswers: ConstitutionType[]): ConstitutionType => {
    if (finalAnswers.length === 0) return '平和质';
    if (finalAnswers.includes('平和质') && finalAnswers.length === 1) return '平和质';
    const pathology = finalAnswers.find(t => t !== '平和质');
    return pathology || '平和质';
  };

  const finishTest = async (finalAnswers: ConstitutionType[]) => {
    setLoading(true);
    const result = getDominantConstitution(finalAnswers);
    
    // 模拟分析过程
    setTimeout(async () => {
      setShowResult(true);
      setLoading(false);
      
      // 自动保存结果到后端
      try {
        setSaveStatus('saving');
        // 注意：实际应用中应从 Context 或 Storage 获取真实用户名，这里简化处理
        const username = localStorage.getItem('last_user') || '访客'; 
        await api.saveTestResult(username, result);
        setSaveStatus('saved');
      } catch (err) {
        console.error("保存失败", err);
        setSaveStatus('error');
      }
    }, 1000);
  };

  const resetTest = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResult(false);
    setSaveStatus('idle');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
        <LoaderIcon className="w-12 h-12 text-tcm-600 animate-spin mb-4" />
        <p className="text-tcm-800 font-serif text-xl">正在分析您的体质...</p>
      </div>
    );
  }

  if (showResult) {
    const resultType = getDominantConstitution(answers);
    const info = RESULTS[resultType];

    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-tcm-200">
          <div className="bg-tcm-800 p-8 text-center text-white relative">
            <h2 className="text-xl opacity-80 mb-2">您的体质辨识结果为</h2>
            <h1 className="text-4xl font-serif font-bold mb-4">{info.title}</h1>
            {saveStatus === 'saved' && (
              <span className="absolute top-4 right-4 bg-green-500/20 text-green-100 text-xs px-2 py-1 rounded-full border border-green-500/50">
                ✓ 结果已保存
              </span>
            )}
          </div>
          
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-tcm-900 border-l-4 border-tcm-500 pl-3 mb-2">
                体质特征
              </h3>
              <p className="text-tcm-700 leading-relaxed">{info.desc}</p>
            </div>

            <div className="bg-tcm-50 p-6 rounded-xl border border-tcm-100">
              <h3 className="text-lg font-bold text-tcm-900 flex items-center gap-2 mb-3">
                <ActivityIcon className="w-5 h-5" />
                调理建议
              </h3>
              <p className="text-tcm-700 leading-relaxed">{info.advice}</p>
            </div>

            <button 
              onClick={resetTest}
              className="w-full bg-white border-2 border-tcm-200 text-tcm-700 font-medium py-3 rounded-xl hover:bg-tcm-50 hover:border-tcm-300 transition-colors"
            >
              重新测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-tcm-900 mb-2">中医体质辨识</h2>
        <p className="text-tcm-600">
          回答以下 9 个问题，快速了解您的体质类型。（简易版）
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-tcm-100 p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
        <div>
          <div className="w-full bg-tcm-100 h-2 rounded-full mb-8">
            <div 
              className="bg-tcm-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <span className="text-sm font-bold text-tcm-400 uppercase tracking-wider">
            问题 {currentStep + 1} / {QUESTIONS.length}
          </span>
          
          <h3 className="text-2xl font-serif font-medium text-tcm-900 mt-4 mb-8 leading-normal">
            {currentQuestion.text}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(false)}
            className="py-4 rounded-xl border-2 border-tcm-100 text-tcm-600 font-medium hover:border-tcm-300 hover:bg-tcm-50 transition-all"
          >
            没有 / 很少
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="py-4 rounded-xl bg-tcm-700 text-white font-medium hover:bg-tcm-800 shadow-md hover:shadow-lg transition-all"
          >
            是的 / 经常
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionTest;
