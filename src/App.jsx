import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, Timer, Zap, Trophy, Music, User, 
  Settings, ChevronRight, CheckCircle2, Circle, 
  Flame, Scale, Ruler, Plus, Minus, Trash2, 
  TrendingUp, Activity, Heart, Utensils, Footprints,
  Coffee, Pizza, Apple, Search, ChevronDown
} from 'lucide-react';

// --- DATA & CONSTANTS ---
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
  "الإثنين": { title: "Rest Day (راحة)", exercises: [] },
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
  "السبت": { title: "Rest Day (راحة)", exercises: [] }
};

const foodDatabase = [
  { name: "صدور دجاج (100ج)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "أرز أبيض مطبوخ (150ج)", cal: 195, protein: 4, carbs: 42, fat: 0.4 },
  { name: "بيض مسلوق (حبة)", cal: 70, protein: 6, carbs: 0.6, fat: 5 },
  { name: "تونا بالماء (علبة)", cal: 120, protein: 26, carbs: 0, fat: 1 },
  { name: "شوفان (50ج)", cal: 190, protein: 7, carbs: 32, fat: 3 },
  { name: "موز (حبة متوسطة)", cal: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { name: "زبدة فول سوداني (ملعقة)", cal: 95, protein: 4, carbs: 3, fat: 8 }
];

const quotes = [
  "البطات اللي تعورك اليوم، هي هيبتك بكرة بالثوب! 🧣",
  "الـ 75 كجم موب بعيدة على وحش مثلك.. دز! 🎯",
  "تذكر الـ HCI.. اجعل تمرينك بسيطاً وفعالاً! 💻",
  "كل موز واشرب كودرد، واصنع المجد يا وحش! 🍌⚡",
  "الاستمرارية هي الفرق بين الحلم والواقع.. دز! 🔥"
];

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('legacy_user_v6') || '{"weight": 75, "height": 175, "age": 25, "gender": "male"}'));
  const [activeDay, setActiveDay] = useState(Object.keys(workoutData)[new Date().getDay()]);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('legacy_done_v6') || '{}'));
  const [sessionData, setSessionData] = useState(() => JSON.parse(localStorage.getItem('legacy_sessions_v6') || '{}'));
  const [cardio, setCardio] = useState(() => JSON.parse(localStorage.getItem('legacy_cardio_v6') || '{"minutes": 0, "type": "walking"}'));
  const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('legacy_meals_v6') || '[]'));
  const [songs, setSongs] = useState(() => JSON.parse(localStorage.getItem('legacy_songs_v6') || '[]'));
  const [view, setView] = useState('dashboard');
  const [timer, setTimer] = useState(0);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('legacy_user_v6', JSON.stringify(user));
    localStorage.setItem('legacy_done_v6', JSON.stringify(completed));
    localStorage.setItem('legacy_sessions_v6', JSON.stringify(sessionData));
    localStorage.setItem('legacy_cardio_v6', JSON.stringify(cardio));
    localStorage.setItem('legacy_meals_v6', JSON.stringify(meals));
    localStorage.setItem('legacy_songs_v6', JSON.stringify(songs));
  }, [user, completed, sessionData, cardio, meals, songs]);

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // --- CALCULATIONS ---
  const bmr = useMemo(() => {
    return Math.round(10 * user.weight + 6.25 * user.height - 5 * user.age + 5);
  }, [user]);

  const calculateCalories = (met, weight, duration) => {
    return Math.round((met * 3.5 * weight) / 200 * duration);
  };

  const burnedWorkout = useMemo(() => {
    const dayData = workoutData[activeDay];
    if (!dayData) return 0;
    return dayData.exercises.reduce((acc, ex) => {
      const key = `${activeDay}-${ex.en}`;
      if (completed[key]) {
        // نعتبر التمرين يأخذ 10 دقائق في المتوسط شاملة الراحة النشطة
        return acc + calculateCalories(ex.met, user.weight, 10);
      }
      return acc;
    }, 0);
  }, [activeDay, completed, user.weight]);

  const burnedCardio = useMemo(() => {
    const met = cardio.type === 'running' ? 10 : 3.8;
    return calculateCalories(met, user.weight, cardio.minutes);
  }, [cardio, user.weight]);

  const stats = useMemo(() => {
    return meals.reduce((acc, m) => ({
      cal: acc.cal + parseInt(m.cal || 0),
      protein: acc.protein + parseInt(m.protein || 0),
      carbs: acc.carbs + parseInt(m.carbs || 0),
      fat: acc.fat + parseInt(m.fat || 0)
    }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const netCalories = stats.cal - (bmr + burnedWorkout + burnedCardio);

  // --- HANDLERS ---
  const addMeal = (food) => {
    setMeals([...meals, { ...food, id: Date.now() }]);
  };

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
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">v6.0 Ultimate</span>
            </div>
          </div>
          <div 
            onClick={() => setTimer(0)}
            className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${timer > 0 ? 'bg-orange-600 border-orange-400 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
            <Timer size={16} />
            <span className="font-mono font-black text-sm">{timer > 0 ? `${timer}s` : 'REST'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Calories Summary Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 rounded-[2.5rem] p-7 relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 text-center">الميزانية الحالية (Net)</p>
                <div className="flex flex-col items-center justify-center py-4">
                  <h2 className={`text-6xl font-black tracking-tighter ${netCalories > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {Math.abs(netCalories)}
                  </h2>
                  <p className="text-xs font-bold opacity-60 mt-2">{netCalories > 0 ? 'فائض (Bulking Mode)' : 'عجز (Cutting Mode)'}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">المستهلك</p>
                    <p className="text-sm font-black text-white">{stats.cal}</p>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">حرق التمارين</p>
                    <p className="text-sm font-black text-orange-500">-{burnedWorkout + burnedCardio}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">BMR</p>
                    <p className="text-sm font-black text-indigo-400">-{bmr}</p>
                  </div>
                </div>

                {/* Macros Progress */}
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>بروتين: {stats.protein}ج</span>
                    <span>كارب: {stats.carbs}ج</span>
                    <span>دهون: {stats.fat}ج</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full flex overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (stats.protein/200)*100)}%` }} />
                    <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (stats.carbs/250)*100)}%` }} />
                    <div className="bg-red-500 h-full" style={{ width: `${Math.min(100, (stats.fat/70)*100)}%` }} />
                  </div>
                </div>
               </div>
               <Flame size={180} className="absolute -right-16 -bottom-16 text-white/5 rotate-12" />
            </div>

            {/* Quick Cardio */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-black flex items-center gap-2"><Footprints className="text-emerald-500" size={18}/> نشاط الكارديو</h3>
                <span className="text-[10px] font-bold text-slate-400">-{burnedCardio} kcal</span>
              </div>
              <div className="flex gap-2 mb-4">
                {['walking', 'running'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setCardio({...cardio, type: t})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${cardio.type === t ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                  >
                    {t === 'walking' ? 'مشي' : 'جري'}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-400 italic">مدة النشاط (دقائق):</span>
                <div className="flex items-center gap-5">
                  <button onClick={() => setCardio({...cardio, minutes: Math.max(0, cardio.minutes - 5)})} className="p-1.5 bg-slate-800 rounded-lg active:scale-90"><Minus size={16}/></button>
                  <span className="text-2xl font-black font-mono text-emerald-400">{cardio.minutes}</span>
                  <button onClick={() => setCardio({...cardio, minutes: cardio.minutes + 5})} className="p-1.5 bg-slate-800 rounded-lg active:scale-90"><Plus size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'workout' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
             <div className="flex overflow-x-auto gap-3 no-scrollbar py-2 snap-x">
              {Object.keys(workoutData).map(d => (
                <button 
                  key={d} onClick={() => setActiveDay(d)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border snap-center ${activeDay === d ? 'bg-indigo-600 border-indigo-400 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
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
                  const exCal = calculateCalories(ex.met, user.weight, 10);
                  return (
                    <div 
                      key={ex.en} 
                      className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-5 transition-all active:scale-[0.98] ${isDone ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 cursor-pointer" onClick={() => { setCompleted({...completed, [key]: !isDone}); if(!isDone) setTimer(90); }}>
                          <div className={`p-4 rounded-2xl transition-all ${isDone ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 text-slate-500'}`}><Dumbbell size={22}/></div>
                          <div>
                            <h4 className={`font-black text-sm tracking-tight ${isDone ? 'line-through text-slate-600' : 'text-white'}`}>{ex.en}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] font-bold text-indigo-400">{ex.ar}</p>
                                <span className="text-[9px] text-orange-500 font-black">-{exCal} cal</span>
                            </div>
                          </div>
                        </div>
                        <div onClick={() => { setCompleted({...completed, [key]: !isDone}); if(!isDone) setTimer(90); }}>
                          {isDone ? <CheckCircle2 className="text-emerald-500" size={28} /> : <Circle className="text-slate-800" size={28} />}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                        <TrendingUp size={14} className="text-indigo-500" />
                        <input 
                            type="text" 
                            placeholder="سجل الوزن المرفوع (PR)..." 
                            value={sessionData[key]?.weight || ''}
                            onChange={(e) => setSessionData({...sessionData, [key]: {...sessionData[key], weight: e.target.value}})}
                            className="bg-transparent text-[11px] font-bold text-slate-300 outline-none w-full placeholder:text-slate-700"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-slate-900/10 rounded-[3rem] border-2 border-dashed border-slate-800/40">
                    <Coffee size={48} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-600 font-bold italic">يوم راحة مستحق.. استمتع بقهوتك ☕</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'food' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
              <h3 className="text-sm font-black mb-6 flex items-center gap-2 text-orange-500"><Search size={18}/> قاعدة بيانات الطعام</h3>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto no-scrollbar pr-2">
                {foodDatabase.map((food, i) => (
                    <button 
                        key={i}
                        onClick={() => addMeal(food)}
                        className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all text-right active:scale-95"
                    >
                        <div>
                            <p className="text-xs font-black text-slate-200">{food.name}</p>
                            <p className="text-[10px] text-slate-500">P:{food.protein} C:{food.carbs} F:{food.fat}</p>
                        </div>
                        <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg text-[10px] font-black">{food.cal} cal</div>
                    </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-500 font-bold mb-4 italic text-center">أو أضف يدوياً:</p>
                <div className="flex gap-2">
                    <input id="custom_f" type="text" placeholder="اسم الوجبة" className="flex-[2] bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs outline-none focus:border-orange-500" />
                    <input id="custom_c" type="number" placeholder="سعرات" className="flex-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs outline-none focus:border-orange-500" />
                    <button 
                        onClick={() => {
                            const n = document.getElementById('custom_f').value;
                            const c = document.getElementById('custom_c').value;
                            if(n && c) { addMeal({name: n, cal: c, protein: 0, carbs: 0, fat: 0}); document.getElementById('custom_f').value=''; document.getElementById('custom_c').value=''; }
                        }}
                        className="p-3 bg-orange-600 rounded-xl active:scale-90"><Plus size={18}/></button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">سجل اليوم</h4>
              {meals.map(m => (
                <div key={m.id} className="bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Apple size={16}/></div>
                    <div><p className="text-xs font-black">{m.name}</p><p className="text-[10px] text-slate-500">{m.cal} kcal</p></div>
                  </div>
                  <button onClick={() => setMeals(meals.filter(x => x.id !== m.id))} className="text-slate-800 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'music' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-7">
              <div className="flex items-center gap-3 mb-8 text-pink-500">
                <Music size={24} />
                <h3 className="text-xl font-black italic">مختبر تحليل الأداء الموسيقي</h3>
              </div>
              <div className="space-y-4">
                <input id="m_art" type="text" placeholder="الفنان (Travis Scott, Linkin Park...)" className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm outline-none focus:border-pink-500" />
                <input id="m_tit" type="text" placeholder="اسم الأغنية اللي تفجرك" className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm outline-none focus:border-pink-500" />
                <div className="py-2">
                    <div className="flex justify-between mb-2 px-1"><span className="text-[10px] font-black text-slate-500 uppercase">Adrenaline Boost</span><span className="text-pink-500 font-black">7/10</span></div>
                    <input type="range" min="1" max="10" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                </div>
                <button onClick={() => {
                  const a = document.getElementById('m_art').value;
                  const t = document.getElementById('m_tit').value;
                  if(a && t) { setSongs([{artist: a, title: t, id: Date.now(), boost: 8}, ...songs]); document.getElementById('m_art').value = ''; document.getElementById('m_tit').value = ''; }
                }} className="w-full py-5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-[1.5rem] font-black text-sm shadow-xl shadow-pink-900/20 active:scale-95 transition-all">حفظ الأداء الموسيقي</button>
              </div>
            </div>
            <div className="space-y-3">
              {songs.map(s => (
                <div key={s.id} className="bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl"><Music size={18}/></div>
                    <div><p className="text-sm font-black text-white">{s.title}</p><p className="text-[10px] text-slate-500 font-bold uppercase">{s.artist}</p></div>
                  </div>
                  <button onClick={() => setSongs(songs.filter(x => x.id !== s.id))} className="text-slate-800 group-hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
              <h3 className="text-sm font-black mb-8 flex items-center gap-2 text-indigo-400"><User size={20}/> إعدادات الـ LEGACY OS</h3>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">الوزن الحالي (kg)</label>
                  <div className="relative">
                    <input type="number" value={user.weight} onChange={e => setUser({...user, weight: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none focus:border-indigo-500" />
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">الطول (cm)</label>
                  <div className="relative">
                    <input type="number" value={user.height} onChange={e => setUser({...user, height: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none focus:border-indigo-500" />
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">العمر</label>
                  <input type="number" value={user.age} onChange={e => setUser({...user, age: parseInt(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">الجنس</label>
                  <select value={user.gender} onChange={e => setUser({...user, gender: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none appearance-none">
                    <option value="male">ذكر (Male)</option>
                    <option value="female">أنثى (Female)</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                <p className="text-[10px] font-bold text-indigo-300 leading-relaxed text-center">
                    يتم استخدام هذه البيانات لحساب معدل الأيض (BMR) وحرق السعرات أثناء التمارين والكارديو بشكل آلي تماماً.
                </p>
              </div>
            </div>

            <button 
                onClick={() => { if(confirm('مسح كل البيانات والبدء من الصفر؟')) { setCompleted({}); setMeals([]); setSongs([]); } }}
                className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest active:bg-red-500 active:text-white transition-all"
            >
                Reset Legacy Data
            </button>
          </div>
        )}

        {/* Dynamic Motivation Footer */}
        <div className="pt-4 pb-10 text-center px-4">
            <p className="text-[11px] font-bold text-slate-600 italic">
               "{quotes[Math.floor(Math.random() * quotes.length)]}"
            </p>
        </div>

      </div>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-5 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-2">
          {[
            {id: 'dashboard', icon: TrendingUp, label: 'لوحة'},
            {id: 'workout', icon: Dumbbell, label: 'تمرين'},
            {id: 'food', icon: Utensils, label: 'تغذية'},
            {id: 'music', icon: Music, label: 'أغاني'},
            {id: 'profile', icon: User, label: 'بروفايل'}
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${view === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-900/50'}`}
            >
              <tab.icon size={18} />
              <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}
