import React, { useState, useEffect, useMemo } from 'react';
import { neon } from '@neondatabase/serverless';
import { 
  Dumbbell, Timer, Zap, Trophy, User, 
  CheckCircle2, Circle, Flame, Minus, Plus, Trash2, 
  TrendingUp, Activity, Utensils, Droplets, Apple, Search, Footprints
} from 'lucide-react';

const sql = neon(import.meta.env.VITE_DATABASE_URL || "");

// --- الجدولة الجديدة (Push-Pull-Legs Antagonist) ---
const workoutData = {
  "الإثنين": { 
    title: "Push (Chest & Biceps)", 
    exercises: [
      { en: "Incline Bench Press", ar: "صدر علوي بنش", met: 6 },
      { en: "Decline Bench Press", ar: "صدر سفلي بنش", met: 6 },
      { en: "Cable Fly", ar: "تجميع كابل", met: 4 },
      { en: "Preacher Curl", ar: "باي لاري", met: 3 },
      { en: "Hammer Curl", ar: "باي هامر", met: 3 },
      { en: "Bayesian Cable Curl", ar: "باي كابل خلفي", met: 3 }
    ] 
  },
  "الثلاثاء": { 
    title: "Pull (Back & Triceps)", 
    exercises: [
      { en: "T-Bar Row", ar: "تي بار رو", met: 6 },
      { en: "Close Grip Lat Pulldown", ar: "سحب ظهر ضيق", met: 5 },
      { en: "One-Arm Lat Pulldown", ar: "سحب ظهر فردي", met: 5 },
      { en: "Overhead Triceps Extension", ar: "تراي فوق الرأس", met: 3 },
      { en: "Dips or Pushdown", ar: "غطس أو دفع كابل", met: 5 },
      { en: "Incline Shrugs", ar: "ترابيس مائل", met: 3 }
    ] 
  },
  "الأربعاء": { 
    title: "Legs (Full Lower)", 
    exercises: [
      { en: "Squat or Hack Squat", ar: "سكوات أو هاك سكوات", met: 8 },
      { en: "Bulgarian Split Squat", ar: "سكوات بلغاري", met: 7 },
      { en: "Leg Extension", ar: "تمديد أرجل", met: 4 },
      { en: "Romanian Deadlift", ar: "ديدلفت روماني", met: 7 },
      { en: "Standing Calf Raise", ar: "بطات واقف", met: 3 }
    ] 
  },
  "الخميس": { title: "Rest Day (راحة)", exercises: [] },
  "الجمعة": { 
    title: "Upper (Shoulders & Arms Focus)", 
    exercises: [
      { en: "Side Delt Raise", ar: "رفرفة جانبي", met: 4 },
      { en: "Rear Delt Fly", ar: "رفرفة خلفي", met: 4 },
      { en: "Bayesian Cable Curl", ar: "باي كابل خلفي", met: 3 },
      { en: "Overhead Triceps Extension", ar: "تراي فوق الرأس", met: 3 },
      { en: "Wrist Curls", ar: "سواعد", met: 2 },
      { en: "Lower back", ar: "أسفل الظهر", met: 3 }
    ] 
  },
  "السبت": { 
    title: "Lower (Posterior Focus)", 
    exercises: [
      { en: "Hip Thrust", ar: "دفع حوض", met: 6 },
      { en: "Seated Leg Curl", ar: "أرجل خلفي جالس", met: 4 },
      { en: "Hack Squat", ar: "هاك سكوات", met: 8 },
      { en: "Standing Calf Raise", ar: "بطات واقف", met: 3 },
      { en: "Behind the back wrist curl", ar: "سواعد خلفي", met: 2 }
    ] 
  },
  "الأحد": { title: "Rest Day (راحة)", exercises: [] }
};

const foodDatabase = [
  { name: "صدور دجاج (100ج)", cal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "أرز أبيض مطبوخ (150ج)", cal: 195, protein: 4, carbs: 42, fat: 0.4 },
  { name: "بيض مسلوق (حبة)", cal: 70, protein: 6, carbs: 0.6, fat: 5 }
];

const quotes = ["البطات اللي تعورك اليوم، هي هيبتك بكرة! 🧣", "75 كجم موب بعيدة على وحش مثلك.. دز! 🎯", "كل موز واشرب كودرد، واصنع المجد! 🍌⚡"];

export default function App() {
  const [user, setUser] = useState({ weight: 75, height: 175, age: 25, gender: "male" });
  const [activeDay, setActiveDay] = useState(new Intl.DateTimeFormat('ar-EG', {weekday: 'long'}).format(new Date()));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('legacy_done_v7') || '{}'));
  const [sessionData, setSessionData] = useState(() => JSON.parse(localStorage.getItem('legacy_sessions_v7') || '{}'));
  const [cardio, setCardio] = useState(() => JSON.parse(localStorage.getItem('legacy_cardio_v7') || '{"minutes": 0, "type": "walking"}'));
  const [water, setWater] = useState(() => parseInt(localStorage.getItem('legacy_water_v7') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('legacy_streak_v7') || '0'));
  const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('legacy_meals_v7') || '[]'));
  const [view, setView] = useState('dashboard');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function initDB() {
      try {
        const data = await sql`SELECT * FROM user_profile ORDER BY id DESC LIMIT 1`;
        if (data.length > 0) {
          setUser({ weight: data[0].weight, height: data[0].height, age: data[0].age, gender: data[0].gender });
        }
      } catch (err) { console.error("Database fetch error:", err); } 
      finally { setLoading(false); }
    }
    initDB();
  }, []);

  useEffect(() => {
    if (loading) return;
    const timeoutId = setTimeout(async () => {
      setSyncing(true);
      try {
        await sql`INSERT INTO user_profile (weight, height, age, gender) VALUES (${user.weight}, ${user.height}, ${user.age}, ${user.gender})`;
      } catch (err) { console.error("Auto-sync failed", err); } 
      finally { setSyncing(false); }
    }, 2000); 
    return () => clearTimeout(timeoutId);
  }, [user, loading]);

  const handleManualSave = async () => {
    try {
      await sql`INSERT INTO user_profile (weight, height, age, gender) VALUES (${user.weight}, ${user.height}, ${user.age}, ${user.gender})`;
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    localStorage.setItem('legacy_done_v7', JSON.stringify(completed));
    localStorage.setItem('legacy_sessions_v7', JSON.stringify(sessionData));
    localStorage.setItem('legacy_cardio_v7', JSON.stringify(cardio));
    localStorage.setItem('legacy_meals_v7', JSON.stringify(meals));
    localStorage.setItem('legacy_water_v7', water.toString());
    localStorage.setItem('legacy_streak_v7', streak.toString());
  }, [completed, sessionData, cardio, meals, water, streak]);

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
    if (!dayData || !dayData.exercises) return 0;
    return dayData.exercises.reduce((acc, ex) => {
      const key = `${activeDay}-${ex.en}`;
      if (completed[key]) return acc + calculateCalories(ex.met, user.weight, 10);
      return acc;
    }, 0);
  }, [activeDay, completed, user.weight]);

  const stats = useMemo(() => meals.reduce((acc, m) => ({
    cal: acc.cal + parseInt(m.cal || 0), protein: acc.protein + parseInt(m.protein || 0),
    carbs: acc.carbs + parseInt(m.carbs || 0), fat: acc.fat + parseInt(m.fat || 0)
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 }), [meals]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic tracking-tighter text-2xl animate-pulse uppercase">Legacy OS</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-36 font-sans rtl" dir="rtl">
      
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl font-black text-xs animate-in slide-in-from-top-8 duration-500 border border-white/20">
          تم حفظ الإعدادات بنجاح ✅
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20"><Activity size={22} /></div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none uppercase italic">Legacy OS</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-[9px] text-orange-400 font-bold uppercase tracking-widest">Streak: {streak}</div>
                {syncing && <div className="text-[7px] text-indigo-400 font-bold animate-pulse tracking-widest uppercase italic">● Syncing</div>}
              </div>
            </div>
          </div>
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 transition-all bg-slate-800 border-slate-700`}>
            <Timer size={16} /><span className="font-mono font-black text-sm">{timer > 0 ? `${timer}s` : 'REST'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 text-center">
             <div className="bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">صافي السعرات اليومية</p>
              <h2 className={`text-6xl font-black ${stats.cal - (bmr + burnedWorkout) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {Math.abs(stats.cal - (bmr + burnedWorkout))}
              </h2>
              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/5">
                <div><p className="text-[9px] text-slate-500 italic uppercase">Food</p><p className="text-xs font-black">{stats.cal}</p></div>
                <div className="border-x border-white/5"><p className="text-[9px] text-slate-500 italic uppercase">Burn</p><p className="text-xs font-black">-{bmr + burnedWorkout}</p></div>
                <div><p className="text-[9px] text-slate-500 italic uppercase">BMI</p><p className="text-xs font-black text-indigo-400">{bmi}</p></div>
              </div>
              <Flame size={150} className="absolute -right-12 -bottom-12 text-white/5 rotate-12" />
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 text-right">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Droplets size={24}/></div>
                <div><p className="text-sm font-black text-white">ترطيب الجسم</p><p className="text-xs text-slate-500 italic">{water} كوب</p></div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setWater(Math.max(0, water - 1))} className="p-2 bg-slate-800 rounded-xl"><Minus size={16}/></button>
                <button onClick={() => setWater(water + 1)} className="p-2 bg-blue-600 rounded-xl shadow-lg"><Plus size={16}/></button>
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
            <div className="px-1"><h2 className="text-xl font-black text-indigo-400">{workoutData[activeDay].title}</h2></div>
            {workoutData[activeDay].exercises.length > 0 ? workoutData[activeDay].exercises.map(ex => {
              const key = `${activeDay}-${ex.en}`;
              const isDone = completed[key];
              return (
                <div key={ex.en} className={`bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 transition-all ${isDone ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                  <div className="flex justify-between items-center" onClick={() => { setCompleted({...completed, [key]: !isDone}); if(!isDone) {setTimer(90); setStreak(s => s + 1);} }}>
                    <div className="flex gap-4 text-right">
                      <div className={`p-4 rounded-2xl ${isDone ? 'bg-emerald-500' : 'bg-slate-800 text-slate-500'}`}><Dumbbell size={22}/></div>
                      <div><p className={`text-sm font-black ${isDone ? 'line-through text-slate-600' : ''}`}>{ex.en}</p><p className="text-[10px] text-indigo-400 font-bold">{ex.ar}</p></div>
                    </div>
                    {isDone ? <CheckCircle2 className="text-emerald-500" size={28}/> : <Circle className="text-slate-800" size={28}/>}
                  </div>
                  <div className="mt-4 flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                    <TrendingUp size={14} className="text-indigo-500" />
                    <input type="text" placeholder="سجل الوزن المرفوع (PR)..." value={sessionData[key]?.weight || ''} onChange={(e) => setSessionData({...sessionData, [key]: {...sessionData[key], weight: e.target.value}})} className="bg-transparent text-[11px] font-bold text-slate-300 outline-none w-full" />
                  </div>
                </div>
              );
            }) : <div className="text-center py-20 text-slate-600 font-bold italic uppercase tracking-widest">Rest Day.. Enjoy Your Coffee ☕</div>}
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-7 h-fit">
              <h3 className="text-sm font-black mb-8 flex items-center gap-2 text-indigo-400"><User size={20}/> الإعدادات الشخصية</h3>
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="space-y-2 text-right"><label className="text-[10px] font-black text-slate-500 uppercase px-1">الوزن (kg)</label><input type="number" value={user.weight} onChange={e => setUser({...user, weight: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-white outline-none focus:border-indigo-500 transition-all" /></div>
                <div className="space-y-2 text-right"><label className="text-[10px] font-black text-slate-500 uppercase px-1">الطول (cm)</label><input type="number" value={user.height} onChange={e => setUser({...user, height: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm font-black text-white outline-none focus:border-indigo-500 transition-all" /></div>
              </div>
              <button onClick={handleManualSave} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-xs uppercase shadow-xl shadow-indigo-900/30 transition-all">حفظ الإعدادات</button>
            </div>
          </div>
        )}

        <div className="pt-4 pb-10 text-center px-4"><p className="text-[10px] font-bold text-slate-600 italic leading-relaxed">"{quotes[Math.floor(Math.random() * quotes.length)]}"</p></div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 p-5 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          {[{id: 'dashboard', icon: TrendingUp, label: 'لوحة'}, {id: 'workout', icon: Dumbbell, label: 'تمرين'}, {id: 'food', icon: Utensils, label: 'تغذية'}, {id: 'profile', icon: User, label: 'أنا'}].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${view === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-900/50'}`}>
              <tab.icon size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
