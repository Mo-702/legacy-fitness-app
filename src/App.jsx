import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, Timer, Zap, Trophy, Music, User, 
  Settings, ChevronRight, CheckCircle2, Circle, 
  Flame, Scale, Ruler, Plus, Minus, Trash2, 
  TrendingUp, Activity, Heart, Utensils, Footprints,
  Coffee, Pizza, Apple, RotateCcw
} from 'lucide-react';

const workoutData = {
  "الأحد": { 
    title: "Upper B (Chest Focus)", 
    exercises: [
      { en: "Incline Bench Press", ar: "صدر علوي بنش", met: 6 },
      { en: "Decline Bench Press", ar: "صدر سفلي بنش", met: 6 },
      { en: "Cable Fly", ar: "تجميع كابل", met: 4 },
      { en: "Preacher Curl", ar: "باي لاري", met: 3 },
      { en: "Hammer Curl", ar: "باي هامر", met: 3 },
      { en: "Bayesian Cable Curl", ar: "باي كابل خلفي", met: 3 },
      { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 },
      { en: "Wrist Curl", ar: "سواعد", met: 2 }
    ]
  },
  "الإثنين": { title: "Rest Day", exercises: [] },
  "الثلاثاء": { 
    title: "Upper C (Arms/Shoulders)", 
    exercises: [
      { en: "Bayesian Cable Curl", ar: "باي كابل خلفي", met: 3 },
      { en: "Incline DB Curl", ar: "باي مائل دامبل", met: 3 },
      { en: "Overhead Triceps Extension", ar: "تراي فوق الرأس", met: 3 },
      { en: "Dips or Pushdown", ar: "غطس أو دفع كابل", met: 5 },
      { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 },
      { en: "Rear Delt Fly", ar: "رفرفة خلفي", met: 4 },
      { en: "Wrist Curls", ar: "سواعد", met: 2 }
    ]
  },
  "الأربعاء": { 
    title: "Lower B (Posterior Focus)", 
    exercises: [
      { en: "Squat or Hack Squat", ar: "سكوات أو هاك سكوات", met: 8 },
      { en: "Hip Thrust", ar: "دفع حوض", met: 6 },
      { en: "Bulgarian Split Squat", ar: "سكوات بلغاري", met: 7 },
      { en: "Standing Calf Raise", ar: "بطات واقف", met: 3 },
      { en: "Wrist curls", ar: "سواعد", met: 2 }
    ]
  },
  "الخميس": { 
    title: "Upper A (Back Focus)", 
    exercises: [
      { en: "T-Bar Row", ar: "تي بار رو", met: 6 },
      { en: "Close Grip Lat Pulldown", ar: "سحب ظهر ضيق", met: 5 },
      { en: "One-Arm Lat Pulldown", ar: "سحب ظهر فردي", met: 5 },
      { en: "Incline Shrugs", ar: "ترابيس مائل", met: 3 },
      { en: "Lower back", ar: "أسفل الظهر", met: 3 },
      { en: "Overhead Triceps Extension", ar: "تراي فوق الرأس", met: 3 },
      { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 },
      { en: "Behind the back wrist curl", ar: "سواعد خلفي", met: 2 }
    ]
  },
  "الجمعة": { 
    title: "Lower A (Quads Focus)", 
    exercises: [
      { en: "Hack Squat", ar: "هاك سكوات", met: 8 },
      { en: "Leg Extension", ar: "تمديد أرجل", met: 4 },
      { en: "Romanian Deadlift", ar: "ديدلفت روماني", met: 7 },
      { en: "Seated Leg Curl", ar: "أرجل خلفي جالس", met: 4 },
      { en: "Standing Calf Raise", ar: "بطات واقف", met: 3 }
    ]
  },
  "السبت": { title: "Rest Day", exercises: [] }
};

const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('legacy_user') || '{"weight": 80, "height": 175, "age": 25, "gender": "male"}'));
  const [activeDay, setActiveDay] = useState(days[new Date().getDay()]);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('legacy_done') || '{}'));
  const [sessionData, setSessionData] = useState(() => JSON.parse(localStorage.getItem('legacy_sessions') || '{}'));
  const [cardio, setCardio] = useState(() => JSON.parse(localStorage.getItem('legacy_cardio') || '{"minutes": 0, "type": "walking"}'));
  const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('legacy_meals') || '[]'));
  const [view, setView] = useState('dashboard');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    localStorage.setItem('legacy_user', JSON.stringify(user));
    localStorage.setItem('legacy_done', JSON.stringify(completed));
    localStorage.setItem('legacy_sessions', JSON.stringify(sessionData));
    localStorage.setItem('legacy_cardio', JSON.stringify(cardio));
    localStorage.setItem('legacy_meals', JSON.stringify(meals));
  }, [user, completed, sessionData, cardio, meals]);

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const bmr = useMemo(() => Math.round(88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age)), [user]);

  const burnedWorkout = useMemo(() => {
    const dayData = workoutData[activeDay];
    if (!dayData) return 0;
    return dayData.exercises.reduce((acc, ex) => {
      const key = `${activeDay}-${ex.en}`;
      if (completed[key]) return acc + 50; // Simple burn per exercise
      return acc;
    }, 0);
  }, [activeDay, completed]);

  const burnedCardio = useMemo(() => {
    const met = cardio.type === 'running' ? 10 : 3.8;
    return Math.round((met * 3.5 * user.weight) / 200 * cardio.minutes);
  }, [cardio, user.weight]);

  const totalConsumed = useMemo(() => meals.reduce((acc, m) => acc + parseInt(m.cal || 0), 0), [meals]);
  const netCalories = totalConsumed - (bmr + burnedWorkout + burnedCardio);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-36 font-sans rtl select-none" dir="rtl">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Activity size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none">LEGACY OS</h1>
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">HCI v5.0</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 transition-all ${timer > 0 ? 'bg-orange-600 border-orange-400 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
            <Timer size={16} />
            <span className="font-mono font-black text-sm">{timer > 0 ? `${timer}s` : 'REST'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">صافي السعرات (Net)</p>
                  <h2 className={`text-6xl font-black tracking-tighter ${netCalories > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {Math.abs(netCalories)}
                  </h2>
                  <p className="text-xs font-bold opacity-50 mt-1">{netCalories > 0 ? 'فائض (Bulking)' : 'عجز (Cutting)'}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/5 text-center">
                  <div><p className="text-[9px] font-bold text-slate-500 uppercase">مستهلك</p><p className="text-sm font-black">{totalConsumed}</p></div>
                  <div className="border-x border-white/5"><p className="text-[9px] font-bold text-slate-500 uppercase">حرق</p><p className="text-sm font-black text-orange-500">{burnedWorkout + burnedCardio}</p></div>
                  <div><p className="text-[9px] font-bold text-slate-500 uppercase">أساسي</p><p className="text-sm font-black text-indigo-400">{bmr}</p></div>
                </div>
                <Zap size={120} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black flex items-center gap-2"><Footprints className="text-emerald-500" size={18}/> الكارديو</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-lg font-bold">-{burnedCardio} kcal</span>
              </div>
              <div className="flex gap-2">
                {['walking', 'running'].map(t => (
                  <button 
                    key={t} onClick={() => setCardio({...cardio, type: t})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border ${cardio.type === t ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                  >
                    {t === 'walking' ? 'مشي' : 'جري'}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between bg-black/20 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-400">المدة (دقيقة):</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setCardio({...cardio, minutes: Math.max(0, cardio.minutes - 5)})} className="p-1 bg-slate-800 rounded-lg"><Minus size={16}/></button>
                  <span className="text-xl font-black font-mono">{cardio.minutes}</span>
                  <button onClick={() => setCardio({...cardio, minutes: cardio.minutes + 5})} className="p-1 bg-slate-800 rounded-lg"><Plus size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'workout' && (
          <div className="space-y-6">
             <div className="flex overflow-x-auto gap-3 no-scrollbar py-2">
              {days.map(d => (
                <button 
                  key={d} onClick={() => setActiveDay(d)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black border transition-all ${activeDay === d ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-500/20' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {workoutData[activeDay]?.exercises.length > 0 ? (
                workoutData[activeDay].exercises.map(ex => {
                  const key = `${activeDay}-${ex.en}`;
                  const isDone = completed[key];
                  return (
                    <div key={ex.en} onClick={() => { setCompleted({...completed, [key]: !isDone}); if(!isDone) setTimer(90); }} className={`p-5 bg-slate-900/40 border-2 rounded-3xl transition-all cursor-pointer ${isDone ? 'border-emerald-500 bg-emerald-500/5 opacity-50' : 'border-white/5'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}><Dumbbell size={20}/></div>
                        <div>
                          <h4 className={`font-black text-sm ${isDone ? 'line-through opacity-50' : ''}`}>{ex.en}</h4>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{ex.ar}</p>
                        </div>
                        {isDone && <CheckCircle2 size={24} className="mr-auto text-emerald-500" />}
                      </div>
                    </div>
                  );
                })
              ) : <div className="text-center py-20 text-slate-600 font-bold italic">يوم راحة.. استمتع 🔋</div>}
            </div>
          </div>
        )}

        {view === 'food' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
              <h3 className="text-sm font-black flex items-center gap-2 text-orange-500"><Utensils size={18}/> إضافة وجبة</h3>
              <input id="f_name" type="text" placeholder="اسم الوجبة" className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm outline-none focus:border-orange-500" />
              <div className="flex gap-3">
                <input id="f_cal" type="number" placeholder="السعرات" className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm outline-none focus:border-orange-500" />
                <button onClick={() => {
                  const n = document.getElementById('f_name').value;
                  const c = document.getElementById('f_cal').value;
                  if(n && c) { setMeals([...meals, {name: n, cal: c, id: Date.now()}]); document.getElementById('f_name').value = ''; document.getElementById('f_cal').value = ''; }
                }} className="px-8 bg-orange-600 rounded-2xl font-black text-sm text-white">إضافة</button>
              </div>
            </div>
            <div className="space-y-3">
              {meals.map(m => (
                <div key={m.id} className="bg-slate-900/20 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-3"><Apple size={16} className="text-orange-500"/><p className="text-xs font-black">{m.name} <span className="text-slate-500 font-normal mr-2">({m.cal} kcal)</span></p></div>
                  <button onClick={() => setMeals(meals.filter(x => x.id !== m.id))} className="text-slate-700 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 p-5 bg-[#020617]/90 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          {[
            {id: 'dashboard', icon: TrendingUp, label: 'لوحة'},
            {id: 'workout', icon: Dumbbell, label: 'تمرين'},
            {id: 'food', icon: Utensils, label: 'أكل'}
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${view === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>
              <tab.icon size={20} /><span className="text-[10px] font-black uppercase">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
