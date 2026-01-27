import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, Timer, Zap, Trophy, Music, User, 
  Settings, ChevronRight, CheckCircle2, Circle, 
  Flame, Scale, Ruler, Plus, Minus, Trash2, 
  TrendingUp, Activity, Heart, Utensils, Footprints,
  Coffee, Pizza, Apple, Search, ChevronDown, Droplets
} from 'lucide-react';

// --- DATA ---
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
  { name: "أرز أبيض مطبوخ (150ج)", cal: 195, protein: 4, carbs: 42, fat: 0.4 },
  { name: "بيض مسلوق (حبة)", cal: 70, protein: 6, carbs: 0.6, fat: 5 }
];

const quotes = ["البطات اللي تعورك اليوم، هي هيبتك بكرة! 🧣", "75 كجم موب بعيدة على وحش مثلك.. دز! 🎯", "كل موز واشرب كودرد، واصنع المجد! 🍌⚡"];

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('legacy_user_v7') || '{"weight": 75, "height": 175, "age": 25, "gender": "male"}'));
  const [activeDay, setActiveDay] = useState(Object.keys(workoutData)[new Date().getDay()]);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('legacy_done_v7') || '{}'));
  const [sessionData, setSessionData] = useState(() => JSON.parse(localStorage.getItem('legacy_sessions_v7') || '{}'));
  const [cardio, setCardio] = useState(() => JSON.parse(localStorage.getItem('legacy_cardio_v7') || '{"minutes": 0, "type": "walking"}'));
  const [water, setWater] = useState(() => parseInt(localStorage.getItem('legacy_water_v7') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('legacy_streak_v7') || '0'));
  const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('legacy_meals_v7') || '[]'));
  const [songs, setSongs] = useState(() => JSON.parse(localStorage.getItem('legacy_songs_v7') || '[]'));
  const [view, setView] = useState('dashboard');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    localStorage.setItem('legacy_user_v7', JSON.stringify(user));
    localStorage.setItem('legacy_done_v7', JSON.stringify(completed));
    localStorage.setItem('legacy_sessions_v7', JSON.stringify(sessionData));
    localStorage.setItem('legacy_cardio_v7', JSON.stringify(cardio));
    localStorage.setItem('legacy_meals_v7', JSON.stringify(meals));
    localStorage.setItem('legacy_songs_v7', JSON.stringify(songs));
    localStorage.setItem('legacy_water_v7', water.toString());
    localStorage.setItem('legacy_streak_v7', streak.toString());
  }, [user, completed, sessionData, cardio, meals, songs, water, streak]);

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const bmr = useMemo(() => Math.round(10 * user.weight + 6.25 * user.height - 5 * user.age + 5), [user]);
  const bmi = useMemo(() => (user.weight / ((user.height / 100) ** 2)).toFixed(1), [user]);
  const calculateCalories = (met, weight, duration) => Math.round((met * 3.5 * weight) / 200 * duration);

  const burnedWorkout = useMemo(() => {
    const dayData = workoutData[activeDay];
    if (!dayData) return 0;
    return dayData.exercises.reduce((acc, ex) => {
      const key = `${activeDay}-${ex.en}`;
      if (completed[key]) return acc + calculateCalories(ex.met, user.weight, 10);
      return acc;
    }, 0);
  }, [activeDay, completed, user.weight]);

  const burnedCardio = useMemo(() => {
    const met = cardio.type === 'running' ? 10 : 3.8;
    return calculateCalories(met, user.weight, cardio.minutes);
  }, [cardio, user.weight]);

  const stats = useMemo(() => meals.reduce((acc, m) => ({
    cal: acc.cal + parseInt(m.cal || 0), protein: acc.protein + parseInt(m.protein || 0),
    carbs: acc.carbs + parseInt(m.carbs || 0), fat: acc.fat + parseInt(m.fat || 0)
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 }), [meals]);

  const netCalories = stats.cal - (bmr + burnedWorkout + burnedCardio);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-36 font-sans rtl select-none" dir="rtl">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20"><Activity size={22} /></div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none">LEGACY OS</h1>
              <div className="flex items-center gap-1 text-[9px] text-orange-400 font-bold uppercase"><Trophy size={10}/> STREAK: {streak} DAYS</div>
            </div>
          </div>
          <div onClick={() => setTimer(0)} className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 transition-all ${timer > 0 ? 'bg-orange-600 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
            <Timer size={16} /><span className="font-mono font-black text-sm">{timer > 0 ? `${timer}s` : 'REST'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Main Stats Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 rounded-[2.5rem] p-7 relative overflow-hidden shadow-2xl">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center mb-2">الميزانية الصافية</p>
              <h2 className={`text-6xl font-black text-center ${netCalories > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{Math.abs(netCalories)}</h2>
              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/5 text-center">
                <div><p className="text-[9px] text-slate-500">أكل</p><p className="text-xs font-black">{stats.cal}</p></div>
                <div className="border-x border-white/5"><p className="text-[9px] text-slate-500">حرق</p><p className="text-xs font-black">-{burnedWorkout + burnedCardio}</p></div>
                <div><p className="text-[9px] text-slate-500">BMI</p><p className="text-xs font-black text-indigo-400">{bmi}</p></div>
              </div>
              <Flame size={150} className="absolute -right-12 -bottom-12 text-white/5 rotate-12" />
            </div>

            {/* Quick Water Tracker */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Droplets size={24}/></div>
                <div><p className="text-sm font-black text-white">ترطيب الجسم</p><p className="text-xs text-slate-500">{water} كوب</p></div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setWater(Math.max(0, water - 1))} className="p-2 bg-slate-800 rounded-xl"><Minus size={16}/></button>
                <button onClick={() => setWater(water + 1)} className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40"><Plus size={16}/></button>
              </div>
            </div>

            {/* Cardio Section */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-black flex items-center gap-2"><Footprints size={16}/> نشاط الكارديو</h3><span className="text-[10px] font-bold text-orange-500">-{burnedCardio} kcal</span></div>
              <div className="flex gap-2 mb-4">
                {['walking', 'running'].map(t => (
                  <button key={t} onClick={() => setCardio({...cardio, type: t})} className={`flex-1 py-3 rounded-xl text-[10px] font-black border ${cardio.type === t ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{t === 'walking' ? 'مشي' : 'جري'}</button>
                ))}
              </div>
              <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-500">المدة (دقائق):</span>
                <div className="flex items-center gap-4"><button onClick={() => setCardio({...cardio, minutes: Math.max(0, cardio.minutes - 5)})} className="p-1 bg-slate-800 rounded-lg"><Minus size={14}/></button><span className="text-xl font-mono font-black">{cardio.minutes}</span><button onClick={() => setCardio({...cardio, minutes: cardio.minutes + 5})} className="p-1 bg-slate-800 rounded-lg"><Plus size={14}/></button></div>
              </div>
            </div>
          </div>
        )}

        {view === 'workout' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-500">
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {Object.keys(workoutData).map(d => (
                <button key={d} onClick={() => setActiveDay(d)} className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all ${activeDay === d ? 'bg-indigo-600 shadow-xl shadow-indigo-900/40' : 'bg-slate-800 text-slate-500'}`}>{d}</button>
              ))}
            </div>
            {workoutData[activeDay].exercises.length > 0 ? workoutData[activeDay].exercises.map(ex => {
              const key = `${activeDay}-${ex.en}`;
              const isDone = completed[key];
              return (
                <div key={ex.en} className={`bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 transition-all ${isDone ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                  <div className="flex justify-between items-center" onClick={() => { setCompleted({...completed, [key]: !isDone}); if(!isDone) {setTimer(90); setStreak(s => s + 1);} }}>
                    <div className="flex gap-4">
                      <div className={`p-4 rounded-2xl ${isDone ? 'bg-emerald-500' : 'bg-slate-800 text-slate-500'}`}><Dumbbell size={22}/></div>
                      <div><p className={`text-sm font-black ${isDone ? 'line-through text-slate-600' : ''}`}>{ex.en}</p><p className="text-[10px] text-indigo-400">{ex.ar}</p></div>
                    </div>
                    {isDone ? <CheckCircle2 className="text-emerald-500" size={28}/> : <Circle className="text-slate-800" size={28}/>}
                  </div>
                  <div className="mt-4 flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                    <TrendingUp size={14} className="text-indigo-500" />
                    <input type="text" placeholder="سجل الوزن المرفوع (PR)..." value={sessionData[key]?.weight || ''} onChange={(e) => setSessionData({...sessionData, [key]: {...sessionData[key], weight: e.target.value}})} className="bg-transparent text-[11px] font-bold text-slate-300 outline-none w-full" />
                  </div>
                </div>
              );
            }) : <div className="text-center py-20 text-slate-600 font-bold">يوم راحة مستحق.. استمتع بقهوتك ☕</div>}
          </div>
        )}

        {view === 'food' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Quick Macros */}
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setMeals([...meals, {name: "بروتين سريع", cal: 80, protein: 20, carbs: 0, fat: 0, id: Date.now()}])} className="bg-blue-600/20 border border-blue-500/30 p-3 rounded-2xl text-[10px] font-black text-blue-400">+20g Protein</button>
              <button onClick={() => setMeals([...meals, {name: "كارب سريع", cal: 120, protein: 0, carbs: 30, fat: 0, id: Date.now()}])} className="bg-emerald-600/20 border border-emerald-500/30 p-3 rounded-2xl text-[10px] font-black text-emerald-400">+30g Carbs</button>
              <button onClick={() => setMeals([...meals, {name: "دهون سريعة", cal: 90, protein: 0, carbs: 0, fat: 10, id: Date.now()}])} className="bg-red-600/20 border border-red-500/30 p-3 rounded-2xl text-[10px] font-black text-red-400">+10g Fat</button>
            </div>
            
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
              <h3 className="text-xs font-black mb-4 flex items-center gap-2 text-orange-500"><Search size={16}/> قاعدة البيانات</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {foodDatabase.map((f, i) => (
                  <div key={i} onClick={() => setMeals([...meals, {...f, id: Date.now()}])} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5 cursor-pointer active:scale-95">
                    <div><p className="text-xs font-black">{f.name}</p><p className="text-[9px] text-slate-500">P:{f.protein} C:{f.carbs} F:{f.fat}</p></div>
                    <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg">{f.cal} cal</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {meals.map(m => (
                <div key={m.id} className="bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                  <div className="flex gap-3"><div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Apple size={16}/></div><div><p className="text-xs font-black">{m.name}</p><p className="text-[10px] text-slate-500">{m.cal} kcal</p></div></div>
                  <button onClick={() => setMeals(meals.filter(x => x.id !== m.id))} className="text-slate-800 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'music' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-7 h-fit">
               <div className="flex items-center gap-3 mb-6 text-pink-500"><Music size={24} /><h3 className="text-xl font-black italic">مختبر تحليل الأداء الموسيقي</h3></div>
               <input id="m_art" type="text" placeholder="الفنان..." className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm mb-3 outline-none focus:border-pink-500" />
               <input id="m_tit" type="text" placeholder="اسم الأغنية..." className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm mb-6 outline-none focus:border-pink-500" />
               <button onClick={() => { const a = document.getElementById('m_art').value; const t = document.getElementById('m_tit').value; if(a && t) { setSongs([{artist: a, title: t, id: Date.now()}, ...songs]); document.getElementById('m_art').value = ''; document.getElementById('m_tit').value = ''; } }} className="w-full py-4 bg-pink-600 rounded-[1.5rem] font-black text-sm shadow-xl shadow-pink-900/20 active:scale-95 transition-all">حفظ الأداء الموسيقي</button>
            </div>
            {songs.map(s => (
              <div key={s.id} className="bg-slate-900/40 p-4 rounded-2xl flex justify-between items-center border border-white/5 group">
                <div className="flex items-center gap-4"><div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl"><Music size={18}/></div><div><p className="text-sm font-black text-white">{s.title}</p><p className="text-[10px] text-slate-500 font-bold uppercase">{s.artist}</p></div></div>
                <button onClick={() => setSongs(songs.filter(x => x.id !== s.id))} className="text-slate-800 group-hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 h-fit">
              <h3 className="text-sm font-black mb-8 flex items-center gap-2 text-indigo-400"><User size={20}/> الإعدادات الشخصية</h3>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase px-1">الوزن (kg)</label><input type="number" value={user.weight} onChange={e => setUser({...user, weight: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase px-1">الطول (cm)</label><input type="number" value={user.height} onChange={e => setUser({...user, height: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase px-1">العمر</label><input type="number" value={user.age} onChange={e => setUser({...user, age: parseInt(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase px-1">الجنس</label><select value={user.gender} onChange={e => setUser({...user, gender: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-indigo-400 outline-none appearance-none"><option value="male">ذكر</option><option value="female">أنثى</option></select></div>
              </div>
            </div>
            <button onClick={() => { if(confirm('مسح كل البيانات؟')) { setCompleted({}); setMeals([]); setSongs([]); setWater(0); setStreak(0); } }} className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs uppercase active:bg-red-500 active:text-white transition-all">Reset Legacy Data</button>
          </div>
        )}

        <div className="pt-4 pb-10 text-center px-4"><p className="text-[11px] font-bold text-slate-600 italic">"{quotes[Math.floor(Math.random() * quotes.length)]}"</p></div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 p-5 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-2">
          {[{id: 'dashboard', icon: TrendingUp, label: 'لوحة'}, {id: 'workout', icon: Dumbbell, label: 'تمرين'}, {id: 'food', icon: Utensils, label: 'تغذية'}, {id: 'music', icon: Music, label: 'أغاني'}, {id: 'profile', icon: User, label: 'أنا'}].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${view === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-900/50'}`}>
              <tab.icon size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
