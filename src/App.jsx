import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, Timer, Zap, Trophy, Music, User, 
  Settings, ChevronRight, CheckCircle2, Circle, 
  Flame, Scale, Ruler, Plus, Minus, Trash2, 
  TrendingUp, Activity, Heart, Utensils, Footprints,
  Coffee, Pizza, Apple, Search, ChevronDown, Droplets
} from 'lucide-react';

// --- DATA & CONSTANTS ---
const workoutData = {
  "الأحد": { title: "Upper B (Chest Focus)", exercises: [{ en: "Incline Bench Press", ar: "صدر علوي بنش", met: 6 }, { en: "Decline Bench Press", ar: "صدر سفلي بنش", met: 6 }, { en: "Cable Fly", ar: "تجميع كابل", met: 4 }, { en: "Preacher Curl", ar: "باي لاري", met: 3 }, { en: "Hammer Curl", ar: "باي هامر", met: 3 }, { en: "Bayesian Cable Curl", ar: "باي كابل خلفي", met: 3 }, { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 }, { en: "Wrist Curl", ar: "سواعد", met: 2 }] },
  "الإثنين": { title: "Rest Day (راحة)", exercises: [] },
  "الثلاثاء": { title: "Upper C (Arms/Shoulders)", exercises: [{ en: "Bayesian Cable Curl", ar: "باي كابل خلفي", met: 3 }, { en: "Incline DB Curl", ar: "باي مائل دامبل", met: 3 }, { en: "Overhead Triceps Extension", ar: "تراي فوق الرأس", met: 3 }, { en: "Dips or Pushdown", ar: "غطس أو دفع كابل", met: 5 }, { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 }, { en: "Rear Delt Fly", ar: "رفرفة خلفي", met: 4 }, { en: "Wrist Curls", ar: "سواعد", met: 2 }] },
  "الأربعاء": { title: "Lower B (Posterior Focus)", exercises: [{ en: "Squat or Hack Squat", ar: "سكوات أو هاك سكوات", met: 8 }, { en: "Hip Thrust", ar: "دفع حوض", met: 6 }, { en: "Bulgarian Split Squat", ar: "سكوات بلغاري", met: 7 }, { en: "Standing Calf Raise", ar: "بطات واقف", met: 3 }, { en: "Wrist curls", ar: "سواعد", met: 2 }] },
  "الخميس": { title: "Upper A (Back Focus)", exercises: [{ en: "T-Bar Row", ar: "تي بار رو", met: 6 }, { en: "Close Grip Lat Pulldown", ar: "سحب ظهر ضيق", met: 5 }, { en: "One-Arm Lat Pulldown", ar: "سحب ظهر فردي", met: 5 }, { en: "Incline Shrugs", ar: "ترابيس مائل", met: 3 }, { en: "Lower back", ar: "أسفل الظهر", met: 3 }, { en: "Overhead Triceps Extension", ar: "تراي فوق الرأس", met: 3 }, { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 }, { en: "Behind the back wrist curl", ar: "سواعد خلفي", met: 2 }] },
  "الجمعة": { title: "Lower A (Quads Focus)", exercises: [{ en: "Hack Squat", ar: "هاك سكوات", met: 8 }, { en: "Leg Extension", ar: "تمديد أرجل", met: 4 }, { en: "Romanian Deadlift", ar: "ديدلفت روماني", met: 7 }, { en: "Seated Leg Curl", ar: "أرجل خلفي جالس", met: 4 }, { en: "Standing Calf Raise", ar: "بطات واقف", met: 3 }] },
  "السبت": { title: "Rest Day (راحة)", exercises: [] }
};

const foodDatabase = [
  { name: "صدور دجاج (100ج)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "أرز أبيض (150ج)", cal: 195, protein: 4, carbs: 42, fat: 0.4 },
  { name: "بيض (حبة)", cal: 70, protein: 6, carbs: 0.6, fat: 5 }
];

const quotes = ["البطات اللي تعورك اليوم، هي هيبتك بكرة! 🧣", "75 كجم موب بعيدة على وحش مثلك.. دز! 🎯"];

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('legacy_user_v7') || '{"weight": 75, "height": 175, "age": 25, "gender": "male"}'));
  const [activeDay, setActiveDay] = useState(Object.keys(workoutData)[new Date().getDay()]);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('legacy_done_v7') || '{}'));
  const [water, setWater] = useState(() => parseInt(localStorage.getItem('legacy_water_v7') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('legacy_streak_v7') || '0'));
  const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('legacy_meals_v7') || '[]'));
  const [view, setView] = useState('dashboard');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    localStorage.setItem('legacy_user_v7', JSON.stringify(user));
    localStorage.setItem('legacy_done_v7', JSON.stringify(completed));
    localStorage.setItem('legacy_meals_v7', JSON.stringify(meals));
    localStorage.setItem('legacy_water_v7', water.toString());
    localStorage.setItem('legacy_streak_v7', streak.toString());
  }, [user, completed, meals, water, streak]);

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const bmr = useMemo(() => Math.round(10 * user.weight + 6.25 * user.height - 5 * user.age + 5), [user]);
  const bmi = useMemo(() => (user.weight / ((user.height / 100) ** 2)).toFixed(1), [user]);
  
  const stats = useMemo(() => meals.reduce((acc, m) => ({
    cal: acc.cal + parseInt(m.cal || 0), protein: acc.protein + parseInt(m.protein || 0),
    carbs: acc.carbs + parseInt(m.carbs || 0), fat: acc.fat + parseInt(m.fat || 0)
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 }), [meals]);

  const addMeal = (f) => setMeals([...meals, { ...f, id: Date.now() }]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-36 font-sans rtl select-none" dir="rtl">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl"><Zap size={20} /></div>
            <div>
              <h1 className="text-md font-black">LEGACY OS</h1>
              <div className="flex items-center gap-1 text-[9px] text-orange-400 font-bold"><Trophy size={10}/> STREAK: {streak} DAYS</div>
            </div>
          </div>
          <div onClick={() => setTimer(0)} className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${timer > 0 ? 'bg-orange-600 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
            <Timer size={14} /><span className="font-mono text-sm">{timer > 0 ? `${timer}s` : 'REST'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {view === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Calories & BMI Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden">
              <p className="text-slate-400 text-[10px] font-black uppercase text-center mb-1">الصافي الحالي</p>
              <h2 className="text-6xl font-black text-center text-emerald-500">{stats.cal - bmr}</h2>
              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/5 text-center">
                <div><p className="text-[9px] text-slate-500">أكل</p><p className="text-sm font-black">{stats.cal}</p></div>
                <div className="border-x border-white/5"><p className="text-[9px] text-slate-500">BMR</p><p className="text-sm font-black">-{bmr}</p></div>
                <div><p className="text-[9px] text-slate-500">BMI</p><p className="text-sm font-black text-indigo-400">{bmi}</p></div>
              </div>
            </div>

            {/* Water Tracker */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Droplets size={20}/></div>
                <div><p className="text-xs font-black">شرب الماء</p><p className="text-[10px] text-slate-500">{water} كوب</p></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setWater(Math.max(0, water - 1))} className="p-2 bg-slate-800 rounded-lg"><Minus size={14}/></button>
                <button onClick={() => setWater(water + 1)} className="p-2 bg-blue-600 rounded-lg"><Plus size={14}/></button>
              </div>
            </div>
          </div>
        )}

        {view === 'food' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => addMeal({name: "بروتين", cal: 80, protein: 20, carbs: 0, fat: 0})} className="bg-blue-600/20 border border-blue-500/30 p-3 rounded-2xl text-[10px] font-black text-blue-400">+20g P</button>
              <button onClick={() => addMeal({name: "كارب", cal: 120, protein: 0, carbs: 30, fat: 0})} className="bg-emerald-600/20 border border-emerald-500/30 p-3 rounded-2xl text-[10px] font-black text-emerald-400">+30g C</button>
              <button onClick={() => addMeal({name: "دهون", cal: 90, protein: 0, carbs: 0, fat: 10})} className="bg-red-600/20 border border-red-500/30 p-3 rounded-2xl text-[10px] font-black text-red-400">+10g F</button>
            </div>
            {/* عرض الوجبات والبحث هنا كالمعتاد */}
          </div>
        )}

        {view === 'workout' && (
          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {Object.keys(workoutData).map(d => (
                <button key={d} onClick={() => setActiveDay(d)} className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap ${activeDay === d ? 'bg-indigo-600' : 'bg-slate-800'}`}>{d}</button>
              ))}
            </div>
            {workoutData[activeDay].exercises.map(ex => {
              const key = `${activeDay}-${ex.en}`;
              const isDone = completed[key];
              return (
                <div key={ex.en} className={`p-4 rounded-3xl border ${isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/40 border-white/5'}`}>
                  <div className="flex justify-between items-center" onClick={() => { setCompleted({...completed, [key]: !isDone}); if(!isDone) {setTimer(90); setStreak(s => s + 1);} }}>
                    <div className="flex gap-3">
                      <div className={`p-3 rounded-xl ${isDone ? 'bg-emerald-500' : 'bg-slate-800'}`}><Dumbbell size={18}/></div>
                      <div><p className={`text-xs font-black ${isDone ? 'line-through opacity-40' : ''}`}>{ex.en}</p></div>
                    </div>
                    {isDone ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-700" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-[#020617]/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          {[{id: 'dashboard', icon: TrendingUp, label: 'لوحة'}, {id: 'workout', icon: Dumbbell, label: 'تمرين'}, {id: 'food', icon: Utensils, label: 'أكل'}, {id: 'profile', icon: User, label: 'أنا'}].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} className={`flex flex-col items-center py-3 rounded-xl ${view === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
              <tab.icon size={18} /><span className="text-[8px] font-black mt-1 uppercase">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
