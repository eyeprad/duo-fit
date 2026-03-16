import { useState } from "react";

/* ─────────────────────────────────────────────
   FONTS & BASE STYLES
───────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0f0f0f;overscroll-behavior:none;}
    input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
    input::placeholder,textarea::placeholder{color:#484848;}
    textarea{resize:none;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    @keyframes popIn{from{transform:scale(0.88);opacity:0}to{transform:scale(1);opacity:1}}
    .fade-up{animation:fadeUp 0.35s ease both;}
    .pop-in{animation:popIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-track{background:#161616;}
    ::-webkit-scrollbar-thumb{background:#2e2e2e;border-radius:3px;}
  `}</style>
);

/* ─────────────────────────────────────────────
   THEME
───────────────────────────────────────────── */
const T = {
  bg:"#0f0f0f", surface:"#161616", card:"#1c1c1c", border:"#272727",
  text:"#f0ece4", sub:"#aaa", muted:"#666", faint:"#252525",
  accent:"#e8d5a3", accentDark:"#b8a573", accentFaint:"#e8d5a312",
  green:"#7eb89a", red:"#c27070", blue:"#7a9fc2", orange:"#d4956a",
  phase:{menstrual:"#c2907a",follicular:"#7eb89a",ovulatory:"#e8d5a3",luteal:"#a07ec2"},
  goal:{fat_loss:"#c27070",strength:"#7a9fc2",endurance:"#7eb89a",tone:"#e8d5a3"},
  split:{upper:"#7a9fc2",lower:"#7eb89a",core:"#c27070",cardio:"#e8d5a3",rest:"#444",custom:"#d4956a"},
};

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const GOALS = [
  {id:"fat_loss",label:"Fat Loss",icon:"🔥",desc:"High-rep circuits, cardio emphasis"},
  {id:"strength",label:"Strength",icon:"💪",desc:"Heavy compound lifts, progressive overload"},
  {id:"endurance",label:"Endurance",icon:"🏃",desc:"Cardio blocks, sustained effort zones"},
  {id:"tone",label:"Tone & Define",icon:"✦",desc:"Moderate weight, high volume, sculpting"},
];

const SPLITS = [
  {id:"upper",label:"Upper Body",icon:"💪"},
  {id:"lower",label:"Lower Body",icon:"🦵"},
  {id:"core",label:"Core",icon:"🔥"},
  {id:"cardio",label:"Walk / Run",icon:"🏃"},
  {id:"rest",label:"Rest Day",icon:"😴"},
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DEFAULT_WEEK = ["upper","lower","rest","core","cardio","lower","rest"];

const PROGRAMS = {
  fat_loss:{
    upper:[
      {name:"Push-Up Circuit",sets:4,reps:"15",rest:"30s",note:"Minimal rest — keep HR up"},
      {name:"Dumbbell Row",sets:4,reps:"15 each",rest:"30s"},
      {name:"Arnold Press",sets:3,reps:"15",rest:"45s"},
      {name:"Lat Pulldown",sets:3,reps:"15",rest:"45s"},
      {name:"Chest Fly",sets:3,reps:"15",rest:"30s"},
      {name:"Tricep Kickback",sets:3,reps:"15",rest:"30s"},
    ],
    lower:[
      {name:"Jump Squat",sets:4,reps:"15",rest:"30s",note:"Explosive — land softly"},
      {name:"Reverse Lunge",sets:3,reps:"12 each",rest:"30s"},
      {name:"Sumo Squat",sets:3,reps:"15",rest:"30s"},
      {name:"Glute Bridge",sets:4,reps:"20",rest:"30s"},
      {name:"Step-Up",sets:3,reps:"12 each",rest:"30s"},
      {name:"Calf Raise",sets:4,reps:"20",rest:"20s"},
    ],
    core:[
      {name:"Burpee",sets:4,reps:"12",rest:"30s",note:"Full body — keep moving"},
      {name:"Mountain Climber",sets:3,reps:"30 sec",rest:"20s"},
      {name:"Plank",sets:3,reps:"45 sec",rest:"30s"},
      {name:"Bicycle Crunch",sets:3,reps:"20",rest:"20s"},
      {name:"V-Up",sets:3,reps:"15",rest:"20s"},
    ],
    cardio:[
      {name:"Dynamic Warm-Up",sets:null,reps:"5 min",rest:null},
      {name:"HIIT Intervals (Sprint/Walk)",sets:8,reps:"30s on / 30s off",rest:null,note:"Max effort on sprints"},
      {name:"Steady-State Jog",sets:null,reps:"15 min",rest:null},
      {name:"Cool-Down Walk",sets:null,reps:"5 min",rest:null},
    ],
  },
  strength:{
    upper:[
      {name:"Bench Press",sets:5,reps:"5",rest:"2–3 min",note:"Heavy — 85–90% of 1RM"},
      {name:"Barbell Row",sets:5,reps:"5",rest:"2–3 min"},
      {name:"Overhead Press",sets:4,reps:"6",rest:"2 min"},
      {name:"Weighted Pull-Up / Lat Pulldown",sets:4,reps:"6",rest:"2 min"},
      {name:"Dips (weighted if possible)",sets:3,reps:"8",rest:"90s"},
      {name:"Barbell Curl",sets:3,reps:"8",rest:"90s"},
    ],
    lower:[
      {name:"Back Squat",sets:5,reps:"5",rest:"3 min",note:"Prioritize depth"},
      {name:"Deadlift",sets:4,reps:"4",rest:"3 min"},
      {name:"Bulgarian Split Squat",sets:3,reps:"6 each",rest:"2 min"},
      {name:"Leg Press (heavy)",sets:3,reps:"8",rest:"2 min"},
      {name:"Romanian Deadlift",sets:3,reps:"8",rest:"90s"},
      {name:"Weighted Calf Raise",sets:4,reps:"10",rest:"60s"},
    ],
    core:[
      {name:"Weighted Plank",sets:4,reps:"45 sec",rest:"60s"},
      {name:"Hanging Leg Raise",sets:4,reps:"10",rest:"60s"},
      {name:"Ab Wheel Rollout",sets:3,reps:"10",rest:"60s"},
      {name:"Cable Woodchop",sets:3,reps:"10 each",rest:"60s"},
      {name:"Pallof Press",sets:3,reps:"12 each",rest:"45s"},
    ],
    cardio:[
      {name:"Dynamic Warm-Up",sets:null,reps:"5 min",rest:null},
      {name:"Steady-State Row or Bike",sets:null,reps:"20 min moderate",rest:null,note:"Zone 2 — conversational pace"},
      {name:"Farmer's Carry",sets:4,reps:"40 meters",rest:"90s"},
      {name:"Cool-Down Stretch",sets:null,reps:"5 min",rest:null},
    ],
  },
  endurance:{
    upper:[
      {name:"Push-Up (slow tempo)",sets:4,reps:"20",rest:"30s"},
      {name:"Resistance Band Row",sets:4,reps:"20",rest:"30s"},
      {name:"Lateral Raise",sets:3,reps:"20",rest:"30s"},
      {name:"Face Pull",sets:3,reps:"20",rest:"30s"},
      {name:"Tricep Extension",sets:3,reps:"20",rest:"30s"},
      {name:"Hammer Curl",sets:3,reps:"20",rest:"30s"},
    ],
    lower:[
      {name:"Squat (bodyweight or light)",sets:4,reps:"25",rest:"30s"},
      {name:"Walking Lunge",sets:4,reps:"20 each",rest:"30s"},
      {name:"Single-Leg Glute Bridge",sets:3,reps:"20 each",rest:"30s"},
      {name:"Wall Sit",sets:3,reps:"60 sec",rest:"30s"},
      {name:"Step-Up",sets:3,reps:"20 each",rest:"30s"},
    ],
    core:[
      {name:"Plank (continuous)",sets:3,reps:"60 sec",rest:"30s"},
      {name:"Side Plank",sets:3,reps:"45 sec each",rest:"30s"},
      {name:"Flutter Kick",sets:3,reps:"30 sec",rest:"20s"},
      {name:"Superman Hold",sets:3,reps:"30 sec",rest:"20s"},
    ],
    cardio:[
      {name:"Easy Walk / Jog Warm-Up",sets:null,reps:"10 min",rest:null},
      {name:"Zone 2 Run",sets:null,reps:"30–45 min",rest:null,note:"Conversational pace — never breathless"},
      {name:"Cool-Down Walk",sets:null,reps:"5 min",rest:null},
      {name:"Full-Body Stretch",sets:null,reps:"5 min",rest:null},
    ],
  },
  tone:{
    upper:[
      {name:"Cable Chest Fly",sets:4,reps:"12",rest:"45s"},
      {name:"Dumbbell Row",sets:4,reps:"12",rest:"45s"},
      {name:"Lateral Raise",sets:3,reps:"15",rest:"30s"},
      {name:"Incline Dumbbell Press",sets:3,reps:"12",rest:"45s"},
      {name:"Rope Tricep Pushdown",sets:3,reps:"15",rest:"30s"},
      {name:"Concentration Curl",sets:3,reps:"12 each",rest:"30s"},
    ],
    lower:[
      {name:"Cable Kickback",sets:4,reps:"15 each",rest:"30s"},
      {name:"Sumo Squat (dumbbell)",sets:4,reps:"15",rest:"45s"},
      {name:"Hip Thrust",sets:4,reps:"15",rest:"45s",note:"Squeeze at top — 2 sec hold"},
      {name:"Curtsy Lunge",sets:3,reps:"12 each",rest:"30s"},
      {name:"Seated Leg Curl",sets:3,reps:"15",rest:"30s"},
      {name:"Standing Calf Raise",sets:4,reps:"20",rest:"20s"},
    ],
    core:[
      {name:"Plank Shoulder Tap",sets:3,reps:"20 total",rest:"30s"},
      {name:"Oblique Crunch",sets:3,reps:"15 each",rest:"30s"},
      {name:"Reverse Crunch",sets:3,reps:"15",rest:"30s"},
      {name:"Dead Bug",sets:3,reps:"10 each",rest:"30s"},
      {name:"Glute Bridge March",sets:3,reps:"12 each",rest:"30s"},
    ],
    cardio:[
      {name:"Jump Rope / High Knees",sets:null,reps:"5 min warm-up",rest:null},
      {name:"Dance Cardio Block",sets:null,reps:"15 min",rest:null,note:"Keep moving — have fun!"},
      {name:"Incline Treadmill Walk",sets:null,reps:"15 min",rest:null},
      {name:"Cool-Down Stretch",sets:null,reps:"5 min",rest:null},
    ],
  },
};

const PHASE_OVERRIDES = {
  menstrual:{
    label:"Menstrual",color:T.phase.menstrual,
    banner:"Intensity reduced for comfort & recovery",
    modifier:(ex)=>ex.map(e=>({
      ...e,
      sets:e.sets?Math.max(2,Math.round(e.sets*0.6)):e.sets,
      reps:typeof e.reps==="string"&&e.reps.includes("sec")
        ?e.reps.replace(/(\d+)\s*sec/,(_,n)=>`${Math.max(20,Math.round(n*0.7))} sec`)
        :e.sets?String(Math.max(8,Math.round(parseInt(e.reps)*0.7))):e.reps,
      note:"Reduce intensity — listen to your body",adjusted:true,
    })),
  },
  luteal:{
    label:"Luteal",color:T.phase.luteal,
    banner:"Slight intensity reduction for late luteal phase",
    modifier:(ex)=>ex.map(e=>({...e,sets:e.sets?Math.max(2,Math.round(e.sets*0.8)):e.sets,adjusted:true})),
  },
};

const SCORE_PER_WORKOUT=100,STREAK_BONUS=25;
const MILESTONES=[
  {score:100,label:"First Blood",icon:"⚡"},
  {score:500,label:"Getting Serious",icon:"🔥"},
  {score:1000,label:"Committed",icon:"💪"},
  {score:2500,label:"Unstoppable",icon:"🏆"},
  {score:5000,label:"Elite",icon:"⭐"},
];

/* ─────────────────────────────────────────────
   CALENDAR / ICS EXPORT
───────────────────────────────────────────── */
const padZ=(n)=>String(n).padStart(2,"0");
const getNextMonday=()=>{const d=new Date();const day=d.getDay();d.setDate(d.getDate()+(day===0?1:8-day));d.setHours(7,0,0,0);return d;};
const fmtICS=(d)=>`${d.getFullYear()}${padZ(d.getMonth()+1)}${padZ(d.getDate())}T${padZ(d.getHours())}${padZ(d.getMinutes())}00`;
const splitLabel=(id,cws=[])=>{
  const cw=cws.find(w=>w.id===id);
  if(cw) return cw.name;
  return {upper:"Upper Body",lower:"Lower Body",core:"Core",cardio:"Walk / Run",rest:"Rest Day"}[id]||id;
};

const buildICS=(schedule,exMap,nickname,goalLabel,cws=[])=>{
  const mon=getNextMonday();
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//DuoFit//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH"];
  schedule.forEach((split,i)=>{
    if(split==="rest") return;
    const d=new Date(mon);d.setDate(mon.getDate()+i);
    const end=new Date(d);end.setMinutes(end.getMinutes()+60);
    const exList=(exMap[split]||[]).map(e=>`${e.name} (${e.sets?`${e.sets}×${e.reps}`:e.reps})`).slice(0,5).join("\\n");
    lines.push(
      "BEGIN:VEVENT",`UID:dfit-${Date.now()}-${i}@duofit`,
      `DTSTART:${fmtICS(d)}`,`DTEND:${fmtICS(end)}`,
      `SUMMARY:💪 DuoFit — ${splitLabel(split,cws)}`,
      `DESCRIPTION:${nickname}'s ${goalLabel} workout\\n\\n${exList}`,
      "BEGIN:VALARM","TRIGGER:-PT30M","ACTION:DISPLAY","DESCRIPTION:Workout in 30 min!","END:VALARM",
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

const downloadICS=(content,filename)=>{
  const blob=new Blob([content],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
};

/* ─────────────────────────────────────────────
   UI COMPONENTS
───────────────────────────────────────────── */
const Card=({children,style,onClick,glow})=>(
  <div onClick={onClick} style={{background:T.card,borderRadius:16,padding:"18px 20px",border:`1px solid ${T.border}`,
    boxShadow:glow?`0 0 24px ${glow}22`:undefined,cursor:onClick?"pointer":undefined,...style}}>
    {children}
  </div>
);
const Btn=({label,onClick,color,outline,full,small,disabled})=>(
  <button onClick={onClick} disabled={disabled} style={{
    background:outline?"transparent":(color||T.accent),
    color:outline?(color||T.accent):"#0f0f0f",
    border:`1.5px solid ${color||T.accent}`,
    borderRadius:10,padding:small?"7px 15px":"12px 22px",
    fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:small?12:14,
    letterSpacing:"0.04em",cursor:disabled?"not-allowed":"pointer",
    width:full?"100%":"auto",opacity:disabled?0.4:1,whiteSpace:"nowrap",
  }}>{label}</button>
);
const Pill=({label,color,small})=>(
  <span style={{display:"inline-block",background:color+"28",color,borderRadius:20,
    padding:small?"2px 9px":"4px 13px",fontSize:small?10:12,fontWeight:700,
    letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>
    {label}
  </span>
);
const FInput=({label,value,onChange,type,placeholder,flex})=>(
  <div style={{flex:flex||1,minWidth:0}}>
    {label&&<div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",
      color:T.muted,marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>{label}</div>}
    <input type={type||"text"} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,
        padding:"11px 14px",color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none"}}/>
  </div>
);
const SegBtn=({options,value,onChange,color})=>(
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    {options.map(([v,l])=>(
      <button key={v} onClick={()=>onChange(v)} style={{padding:"8px 15px",borderRadius:10,
        border:`1.5px solid ${value===v?(color||T.accent):T.border}`,
        background:value===v?(color||T.accent)+"18":"transparent",
        color:value===v?(color||T.accent):T.muted,
        fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
        {l}
      </button>
    ))}
  </div>
);
const BottomNav=({tab,setTab})=>{
  const tabs=[["home","Home","⌂"],["schedule","Schedule","📅"],["builder","Builder","✏️"],["board","Leaderboard","⚔️"]];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",
      maxWidth:540,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:50,
      paddingBottom:8}}>
      {tabs.map(([id,label,icon])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"10px 4px 6px",background:"transparent",
          border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <span style={{fontSize:18,lineHeight:1}}>{icon}</span>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
            color:tab===id?T.accent:T.muted,fontFamily:"'DM Sans',sans-serif"}}>{label}</span>
          {tab===id&&<div style={{width:18,height:2,borderRadius:2,background:T.accent}}/>}
        </button>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   DEFAULT STATE
───────────────────────────────────────────── */
const defaultProfile=()=>({
  nickname:"",gender:"male",age:"",weight:"",
  heightFt:"",heightIn:"",heightCm:"",unit:"imperial",
  goal:"strength",cyclePhase:"follicular",
});
const initState=()=>({
  profiles:[defaultProfile(),defaultProfile()],
  onboarded:false,
  cycleGlobalEnabled:true,
  workoutLog:[],
  nudges:[],
  checkins:[],
  schedules:[[...DEFAULT_WEEK],[...DEFAULT_WEEK]],
  customWorkouts:[],
});

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App(){
  const [state,setState]=useState(initState);
  const [tab,setTab]=useState("home");
  const [screen,setScreen]=useState("onboard");
  const [activeUser,setActiveUser]=useState(0);
  const [onboardStep,setOnboardStep]=useState(0);
  const [workoutSplit,setWorkoutSplit]=useState(null);
  const [workoutIsCustom,setWorkoutIsCustom]=useState(false);
  const [wLogs,setWLogs]=useState({});
  const [showNudge,setShowNudge]=useState(false);
  const [nudgeMsg,setNudgeMsg]=useState("");
  const [showCheckin,setShowCheckin]=useState(false);
  const [checkinMsg,setCheckinMsg]=useState("");
  const [toast,setToast]=useState(null);
  const [viewingPartner,setViewingPartner]=useState(false);
  const [editingWorkout,setEditingWorkout]=useState(null);

  const showToast=(msg,color)=>{setToast({msg,color:color||T.accent});setTimeout(()=>setToast(null),3000);};
  const upd=(k,v)=>setState(p=>({...p,[k]:v}));
  const updProfile=(idx,u)=>setState(p=>({...p,profiles:p.profiles.map((x,i)=>i===idx?{...x,...u}:x)}));

  const p0=state.profiles[0],p1=state.profiles[1];
  const me=state.profiles[activeUser];
  const partner=state.profiles[activeUser===0?1:0];
  const partnerId=activeUser===0?1:0;

  const myLogs=state.workoutLog.filter(l=>l.userId===activeUser);
  const partnerLogs=state.workoutLog.filter(l=>l.userId===partnerId);
  const calcStreak=(logs)=>{
    const dates=[...new Set(logs.map(l=>l.date))].sort().reverse();
    if(!dates.length) return 0;
    let streak=0,cur=new Date(new Date().toISOString().split("T")[0]);
    for(let d of dates){
      const diff=Math.floor((cur-new Date(d))/86400000);
      if(diff>streak+1) break;
      streak++;cur=new Date(d);
    }
    return streak;
  };
  const myStreak=calcStreak(myLogs);
  const partnerStreak=calcStreak(partnerLogs);
  const myScore=myLogs.reduce((a,l)=>a+(l.score||0),0);
  const partnerScore=partnerLogs.reduce((a,l)=>a+(l.score||0),0);
  const today=new Date().toISOString().split("T")[0];
  const workedOutToday=myLogs.some(l=>l.date===today);
  const partnerWorkedToday=partnerLogs.some(l=>l.date===today);

  const cycleActive=state.cycleGlobalEnabled&&me.gender==="female"&&PHASE_OVERRIDES[me.cyclePhase];
  const partnerCycleActive=state.cycleGlobalEnabled&&partner.gender==="female"&&PHASE_OVERRIDES[partner.cyclePhase];
  const anyCycleActive=cycleActive||partnerCycleActive;
  const activeCyclePhase=(cycleActive?me.cyclePhase:null)||(partnerCycleActive?partner.cyclePhase:null);

  const getExercises=(splitId,isCustom)=>{
    if(isCustom){const cw=state.customWorkouts.find(w=>w.id===splitId);return cw?cw.exercises:[];}
    let ex=(PROGRAMS[me.goal]?.[splitId]||[]).map(e=>({...e}));
    if(anyCycleActive&&activeCyclePhase&&PHASE_OVERRIDES[activeCyclePhase])
      ex=PHASE_OVERRIDES[activeCyclePhase].modifier(ex);
    return ex;
  };

  const saveWorkout=()=>{
    const exercises=getExercises(workoutSplit,workoutIsCustom).map((ex,i)=>({name:ex.name,logs:wLogs[i]||{}}));
    const score=SCORE_PER_WORKOUT+(myStreak>0?STREAK_BONUS:0);
    setState(p=>({...p,workoutLog:[{date:today,userId:activeUser,split:workoutSplit,isCustom:workoutIsCustom,exercises,score},...p.workoutLog]}));
    showToast(`+${score} pts! ${myStreak+1} day streak 🔥`,T.accent);
    setWLogs({});setScreen("home");setWorkoutSplit(null);setWorkoutIsCustom(false);
  };

  const mySchedule=state.schedules[activeUser];
  const setMySchedule=(s)=>setState(p=>({...p,schedules:p.schedules.map((x,i)=>i===activeUser?s:x)}));

  const exportWeek=()=>{
    const goal=GOALS.find(g=>g.id===me.goal);
    const exMap={};
    mySchedule.forEach(sp=>{if(sp!=="rest"&&!exMap[sp])exMap[sp]=getExercises(sp,false);});
    const ics=buildICS(mySchedule,exMap,me.nickname||"You",goal?.label||"Training",state.customWorkouts);
    downloadICS(ics,`duofit-week-${me.nickname||"schedule"}.ics`);
    showToast("Week exported! Open the .ics to import to your calendar 📅",T.green);
  };

  const exportDay=(dayIdx)=>{
    const sp=mySchedule[dayIdx];
    if(sp==="rest"){showToast("Rest day — nothing to export",T.muted);return;}
    const isC=!!state.customWorkouts.find(w=>w.id===sp);
    const exMap={[sp]:getExercises(sp,isC)};
    const singleDay=Array(7).fill("rest").map((_,i)=>i===dayIdx?sp:"rest");
    const goal=GOALS.find(g=>g.id===me.goal);
    const ics=buildICS(singleDay,exMap,me.nickname||"You",goal?.label||"Training",state.customWorkouts);
    downloadICS(ics,`duofit-${DAY_FULL[dayIdx]}.ics`);
    showToast(`${DAY_FULL[dayIdx]} exported! 📅`,T.green);
  };

  // Builder
  const saveCustom=()=>{
    if(!editingWorkout?.name?.trim()||!editingWorkout.exercises.length) return;
    if(editingWorkout.id){
      setState(p=>({...p,customWorkouts:p.customWorkouts.map(w=>w.id===editingWorkout.id?{...editingWorkout}:w)}));
    } else {
      setState(p=>({...p,customWorkouts:[...p.customWorkouts,{...editingWorkout,id:String(Date.now())}]}));
    }
    setEditingWorkout(null);showToast("Workout saved! ✓",T.green);
  };
  const deleteCustom=(id)=>setState(p=>({...p,customWorkouts:p.customWorkouts.filter(w=>w.id!==id)}));
  const addExercise=()=>setEditingWorkout(p=>({...p,exercises:[...p.exercises,{name:"",sets:3,reps:"10",rest:"60s",note:""}]}));
  const updEx=(idx,field,val)=>setEditingWorkout(p=>({...p,exercises:p.exercises.map((e,i)=>i===idx?{...e,[field]:val}:e)}));
  const removeEx=(idx)=>setEditingWorkout(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)}));

  const nudges4me=state.nudges.filter(n=>n.to===activeUser).slice(0,3);
  const viewLogs=viewingPartner?partnerLogs:myLogs;
  const viewScore=viewingPartner?partnerScore:myScore;
  const viewStreak=viewingPartner?partnerStreak:myStreak;
  const nextMilestone=MILESTONES.find(m=>m.score>viewScore);
  const achieved=MILESTONES.filter(m=>m.score<=viewScore);
  const splitColors={upper:T.blue,lower:T.green,core:T.red,cardio:T.accent,rest:T.faint,custom:T.orange};

  /* ──────────────────────────────────────────
     ONBOARDING
  ────────────────────────────────────────── */
  if(!state.onboarded){
    const pIdx=onboardStep<2?0:1;
    const inner=onboardStep%2;
    const p=state.profiles[pIdx];
    const setP=u=>updProfile(pIdx,u);
    return(
      <div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'DM Sans',sans-serif"}}>
        <FontLoader/>
        <div style={{maxWidth:480,width:"100%"}} className="fade-up">
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,color:T.accent,letterSpacing:5,lineHeight:1}}>DUO FIT</div>
            <div style={{color:T.muted,fontSize:13,marginTop:6}}>Partner {pIdx+1} of 2 · Step {inner+1} of 2</div>
            <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:14}}>
              {[0,1,2,3].map(i=><div key={i} style={{height:3,width:i===onboardStep?28:8,borderRadius:3,background:i<=onboardStep?T.accent:T.faint,transition:"all 0.3s"}}/>)}
            </div>
          </div>
          <Card style={{marginBottom:14}}>
            {inner===0&&(
              <>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,marginBottom:20}}>{pIdx===0?"FIRST, YOU.":"NOW YOUR PARTNER."}</div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <FInput label="Nickname" value={p.nickname} onChange={v=>setP({nickname:v})} placeholder="What do they call you?"/>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.muted,marginBottom:8}}>Gender</div>
                    <SegBtn options={[["male","♂ Male"],["female","♀ Female"],["other","Other"]]} value={p.gender} onChange={v=>setP({gender:v})}/>
                  </div>
                  <FInput label="Age" type="number" value={p.age} onChange={v=>setP({age:v})} placeholder="26"/>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.muted,marginBottom:8}}>Units</div>
                    <SegBtn options={[["imperial","Imperial (lbs / ft)"],["metric","Metric (kg / cm)"]]} value={p.unit||"imperial"} onChange={v=>setP({unit:v})}/>
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.muted,marginBottom:8}}>Height</div>
                    {(p.unit||"imperial")==="imperial"?(
                      <div style={{display:"flex",gap:10}}>
                        <FInput value={p.heightFt} onChange={v=>setP({heightFt:v})} type="number" placeholder="5 ft" flex={1}/>
                        <FInput value={p.heightIn} onChange={v=>setP({heightIn:v})} type="number" placeholder="8 in" flex={1}/>
                      </div>
                    ):(
                      <FInput value={p.heightCm} onChange={v=>setP({heightCm:v})} type="number" placeholder="173 cm"/>
                    )}
                  </div>
                  <FInput label={`Weight (${(p.unit||"imperial")==="imperial"?"lbs":"kg"})`} type="number" value={p.weight} onChange={v=>setP({weight:v})} placeholder={(p.unit||"imperial")==="imperial"?"155":"70"}/>
                </div>
              </>
            )}
            {inner===1&&(
              <>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,marginBottom:20}}>YOUR GOAL.</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                  {GOALS.map(g=>(
                    <div key={g.id} onClick={()=>setP({goal:g.id})} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:12,border:`1.5px solid ${p.goal===g.id?T.goal[g.id]:T.border}`,background:p.goal===g.id?T.goal[g.id]+"14":T.surface,cursor:"pointer",transition:"all 0.18s"}}>
                      <div style={{fontSize:22}}>{g.icon}</div>
                      <div>
                        <div style={{fontSize:15,fontWeight:600,color:p.goal===g.id?T.goal[g.id]:T.text}}>{g.label}</div>
                        <div style={{fontSize:12,color:T.muted}}>{g.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {p.gender==="female"&&(
                  <div style={{padding:"14px 16px",borderRadius:12,background:T.surface,border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.sub,marginBottom:10}}>Current Cycle Phase</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {Object.entries(T.phase).map(([k,col])=>(
                        <div key={k} onClick={()=>setP({cyclePhase:k})} style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${p.cyclePhase===k?col:T.border}`,background:p.cyclePhase===k?col+"18":"transparent",cursor:"pointer"}}>
                          <div style={{fontSize:12,fontWeight:700,color:p.cyclePhase===k?col:T.muted,textTransform:"capitalize"}}>{k}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
          <div style={{display:"flex",gap:10}}>
            {onboardStep>0&&<Btn label="← Back" outline onClick={()=>setOnboardStep(s=>s-1)} color={T.muted}/>}
            <Btn label={onboardStep===3?"Let's Train →":"Continue →"} full onClick={()=>{if(onboardStep<3)setOnboardStep(s=>s+1);else upd("onboarded",true);}}/>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────
     WORKOUT SCREEN
  ────────────────────────────────────────── */
  if(screen==="workout"&&workoutSplit){
    const exercises=getExercises(workoutSplit,workoutIsCustom);
    const cw=workoutIsCustom?state.customWorkouts.find(w=>w.id===workoutSplit):null;
    const cycleInfo=!workoutIsCustom&&anyCycleActive&&activeCyclePhase?PHASE_OVERRIDES[activeCyclePhase]:null;
    const label=workoutIsCustom?(cw?.name||"Custom"):{upper:"Upper Body",lower:"Lower Body",core:"Core",cardio:"Walk / Run"}[workoutSplit]||workoutSplit;
    return(
      <div style={{background:T.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:T.text,maxWidth:540,margin:"0 auto",padding:"20px 16px 50px"}}>
        <FontLoader/>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <button onClick={()=>{setScreen("home");setWorkoutSplit(null);setWorkoutIsCustom(false);}} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",color:T.text,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>← Back</button>
          <div>
            <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em"}}>{me.nickname} · {workoutIsCustom?"Custom":GOALS.find(g=>g.id===me.goal)?.label}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>{label}</div>
          </div>
        </div>
        {cycleInfo&&(
          <div style={{background:cycleInfo.color+"18",border:`1px solid ${cycleInfo.color}40`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}} className="pop-in">
            <span style={{fontSize:18}}>🌙</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:cycleInfo.color}}>Cycle Mode Active — {cycleInfo.label}</div>
              <div style={{fontSize:12,color:T.muted}}>{cycleInfo.banner}</div>
            </div>
          </div>
        )}
        {exercises.map((ex,i)=>{
          const log=wLogs[i]||{};
          return(
            <Card key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:600,color:ex.adjusted?T.phase[activeCyclePhase]||T.text:T.text}}>{ex.name}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:2}}>{ex.sets?`${ex.sets} sets × ${ex.reps}`:ex.reps}{ex.rest?` · ${ex.rest} rest`:""}</div>
                  {ex.note&&<div style={{fontSize:11,color:T.accentDark,marginTop:3,fontStyle:"italic"}}>{ex.note}</div>}
                </div>
                {ex.adjusted&&<Pill label="Adjusted" color={T.phase[activeCyclePhase]||T.muted} small/>}
              </div>
              {ex.sets&&(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 64px",gap:6,marginBottom:6}}>
                    {["#","Weight","Reps","Done"].map(h=><div key={h} style={{fontSize:10,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</div>)}
                  </div>
                  {Array.from({length:ex.sets}).map((_,si)=>(
                    <div key={si} style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 64px",gap:6,marginBottom:6,alignItems:"center"}}>
                      <div style={{fontSize:13,color:T.muted,fontWeight:600}}>{si+1}</div>
                      <input type="number" placeholder="lbs" value={log[si]?.weight||""} onChange={e=>setWLogs(p=>({...p,[i]:{...(p[i]||{}),[si]:{...(p[i]?.[si]||{}),weight:e.target.value}}}))} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 10px",color:T.text,fontFamily:"inherit",fontSize:14,outline:"none"}}/>
                      <input type="number" placeholder={ex.reps} value={log[si]?.reps||""} onChange={e=>setWLogs(p=>({...p,[i]:{...(p[i]||{}),[si]:{...(p[i]?.[si]||{}),reps:e.target.value}}}))} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 10px",color:T.text,fontFamily:"inherit",fontSize:14,outline:"none"}}/>
                      <button onClick={()=>setWLogs(p=>({...p,[i]:{...(p[i]||{}),[si]:{...(p[i]?.[si]||{}),done:!p[i]?.[si]?.done}}}))} style={{background:log[si]?.done?T.green+"20":T.surface,border:`1px solid ${log[si]?.done?T.green:T.border}`,borderRadius:8,padding:8,color:log[si]?.done?T.green:T.muted,cursor:"pointer",fontSize:16}}>
                        {log[si]?.done?"✓":"○"}
                      </button>
                    </div>
                  ))}
                </>
              )}
            </Card>
          );
        })}
        <div style={{marginTop:12}}><Btn label={`Complete Workout · +${SCORE_PER_WORKOUT+(myStreak>0?STREAK_BONUS:0)} pts`} full onClick={saveWorkout}/></div>
      </div>
    );
  }

  /* ──────────────────────────────────────────
     BUILDER EDITOR
  ────────────────────────────────────────── */
  if(editingWorkout!==null){
    const ew=editingWorkout;
    return(
      <div style={{background:T.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:T.text,maxWidth:540,margin:"0 auto",padding:"20px 16px 50px"}}>
        <FontLoader/>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <button onClick={()=>setEditingWorkout(null)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",color:T.text,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>← Back</button>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>{ew.id?"EDIT WORKOUT":"NEW WORKOUT"}</div>
        </div>
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",gap:12}}>
            <FInput label="Workout Name" value={ew.name} onChange={v=>setEditingWorkout(p=>({...p,name:v}))} placeholder="e.g. Leg Day Destroyer" flex={3}/>
            <FInput label="Icon" value={ew.icon} onChange={v=>setEditingWorkout(p=>({...p,icon:v}))} placeholder="🏋️" flex={1}/>
          </div>
        </Card>
        {ew.exercises.length===0&&(
          <div style={{textAlign:"center",padding:"24px 0",color:T.muted,fontSize:13}}>No exercises yet. Add your first one below.</div>
        )}
        {ew.exercises.map((ex,i)=>(
          <Card key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Exercise {i+1}</div>
              <button onClick={()=>removeEx(i)} style={{background:"transparent",border:"none",color:T.red,cursor:"pointer",fontSize:18,padding:4}}>✕</button>
            </div>
            <FInput label="Name" value={ex.name} onChange={v=>updEx(i,"name",v)} placeholder="e.g. Back Squat"/>
            <div style={{display:"flex",gap:10,marginTop:10}}>
              <FInput label="Sets" type="number" value={String(ex.sets||"")} onChange={v=>updEx(i,"sets",parseInt(v)||0)} placeholder="3" flex={1}/>
              <FInput label="Reps" value={ex.reps} onChange={v=>updEx(i,"reps",v)} placeholder="10" flex={1}/>
              <FInput label="Rest" value={ex.rest} onChange={v=>updEx(i,"rest",v)} placeholder="60s" flex={1}/>
            </div>
            <div style={{marginTop:10}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.muted,marginBottom:6}}>Note</div>
              <textarea value={ex.note||""} onChange={e=>updEx(i,"note",e.target.value)} placeholder="Coaching cue or tip..." style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:13,height:52,outline:"none"}}/>
            </div>
          </Card>
        ))}
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <Btn label="+ Add Exercise" outline full onClick={addExercise} color={T.orange}/>
        </div>
        <div style={{marginTop:10}}>
          <Btn label="Save Workout ✓" full onClick={saveCustom} disabled={!ew.name?.trim()||!ew.exercises.length}/>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────
     SCHEDULE TAB
  ────────────────────────────────────────── */
  const ScheduleTab=()=>{
    const todayDow=(new Date().getDay()+6)%7;
    return(
      <div className="fade-up">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:3}}>WEEKLY PLAN</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{me.nickname} · {GOALS.find(g=>g.id===me.goal)?.label}</div>
          </div>
          <Btn label="📅 Export Week" small onClick={exportWeek} color={T.green}/>
        </div>

        <Card style={{marginBottom:14,padding:"13px 16px",background:T.surface}}>
          <div style={{fontSize:12,color:T.sub,fontWeight:600,marginBottom:3}}>📲 Calendar Import</div>
          <div style={{fontSize:12,color:T.muted,lineHeight:1.5}}>Exporting downloads an .ics file. On iPhone, open it and tap "Add All" — it imports to Apple Calendar with 30-min reminders. Works with Google Calendar & Outlook too.</div>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {DAYS.map((day,i)=>{
            const sp=mySchedule[i];
            const isCustomId=!!state.customWorkouts.find(w=>w.id===sp);
            const cw=isCustomId?state.customWorkouts.find(w=>w.id===sp):null;
            const isToday=i===todayDow;
            const col=isCustomId?T.orange:(splitColors[sp]||T.muted);
            return(
              <div key={i} style={{borderRadius:14,border:`1.5px solid ${isToday?T.accent:T.border}`,background:isToday?T.accent+"08":T.card,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
                  <div style={{width:38,flexShrink:0}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:isToday?T.accent:T.sub,letterSpacing:1,lineHeight:1}}>{day}</div>
                    {isToday&&<div style={{fontSize:9,color:T.accent,fontWeight:700,letterSpacing:"0.06em"}}>TODAY</div>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:col}}>
                      {isCustomId?(cw?.icon||"🏋️")+" "+(cw?.name||"Custom"):(SPLITS.find(s=>s.id===sp)?.icon||"")+" "+(SPLITS.find(s=>s.id===sp)?.label||sp)}
                    </div>
                  </div>
                  <button onClick={()=>exportDay(i)} style={{background:"transparent",border:"none",color:sp==="rest"?T.faint:T.muted,cursor:sp==="rest"?"default":"pointer",fontSize:15,padding:4}} title={`Export ${DAY_FULL[i]}`}>📤</button>
                </div>
                {/* Picker row */}
                <div style={{padding:"0 14px 12px",display:"flex",gap:6,flexWrap:"wrap"}}>
                  {SPLITS.map(s=>(
                    <button key={s.id} onClick={()=>setMySchedule(mySchedule.map((x,xi)=>xi===i?s.id:x))} style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${sp===s.id?splitColors[s.id]:T.border}`,background:sp===s.id?splitColors[s.id]+"22":"transparent",color:sp===s.id?splitColors[s.id]:T.muted,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                  {state.customWorkouts.map(cw2=>(
                    <button key={cw2.id} onClick={()=>setMySchedule(mySchedule.map((x,xi)=>xi===i?cw2.id:x))} style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${sp===cw2.id?T.orange:T.border}`,background:sp===cw2.id?T.orange+"22":"transparent",color:sp===cw2.id?T.orange:T.muted,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                      {cw2.icon||"✏️"} {cw2.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Card>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,marginBottom:12}}>WEEK SUMMARY</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["upper","lower","core","cardio","rest"].map(s=>{
              const count=mySchedule.filter(x=>x===s).length;
              if(!count) return null;
              const col=splitColors[s]||T.muted;
              return(
                <div key={s} style={{background:col+"18",border:`1px solid ${col}30`,borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontSize:18}}>{SPLITS.find(sp=>sp.id===s)?.icon||"—"}</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:col,lineHeight:1}}>{count}</div>
                  <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2}}>{s}</div>
                </div>
              );
            })}
            {state.customWorkouts.map(cw2=>{
              const count=mySchedule.filter(x=>x===cw2.id).length;
              if(!count) return null;
              return(
                <div key={cw2.id} style={{background:T.orange+"18",border:`1px solid ${T.orange}30`,borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontSize:18}}>{cw2.icon||"🏋️"}</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:T.orange,lineHeight:1}}>{count}</div>
                  <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2,maxWidth:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cw2.name}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  /* ──────────────────────────────────────────
     BUILDER TAB
  ────────────────────────────────────────── */
  const BuilderTab=()=>(
    <div className="fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:3}}>WORKOUT BUILDER</div>
          <div style={{fontSize:12,color:T.muted,marginTop:2}}>Design custom sessions for any goal</div>
        </div>
        <Btn label="+ New" onClick={()=>setEditingWorkout({name:"",icon:"🏋️",exercises:[]})} color={T.orange}/>
      </div>
      {state.customWorkouts.length===0&&(
        <Card style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:40,marginBottom:12}}>🏗️</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>No custom workouts yet</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Build workouts exactly how you want — any equipment, any style, any goal.</div>
          <Btn label="Build Your First Workout" onClick={()=>setEditingWorkout({name:"",icon:"🏋️",exercises:[]})} color={T.orange}/>
        </Card>
      )}
      {state.customWorkouts.map(cw=>(
        <Card key={cw.id} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:24}}>{cw.icon||"🏋️"}</span>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1.5}}>{cw.name}</div>
              </div>
              <div style={{fontSize:12,color:T.muted,marginBottom:8}}>{cw.exercises.length} exercise{cw.exercises.length!==1?"s":""}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {cw.exercises.slice(0,4).map((e,i)=>(
                  <span key={i} style={{fontSize:11,background:T.orange+"18",color:T.orange,borderRadius:20,padding:"2px 9px",fontWeight:600}}>{e.name||"Unnamed"}</span>
                ))}
                {cw.exercises.length>4&&<span style={{fontSize:11,color:T.muted,alignSelf:"center"}}>+{cw.exercises.length-4} more</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginLeft:12}}>
              <button onClick={()=>setEditingWorkout({...cw,exercises:cw.exercises.map(e=>({...e}))})} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 14px",color:T.sub,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>Edit</button>
              <button onClick={()=>deleteCustom(cw.id)} style={{background:"transparent",border:"none",color:T.red,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>Delete</button>
            </div>
          </div>
          <div style={{marginTop:14}}>
            <Btn label="Start This Workout →" full small onClick={()=>{setWorkoutSplit(cw.id);setWorkoutIsCustom(true);setScreen("workout");}} color={T.orange}/>
          </div>
        </Card>
      ))}
    </div>
  );

  /* ──────────────────────────────────────────
     LEADERBOARD TAB
  ────────────────────────────────────────── */
  const BoardTab=()=>{
    const rows=[0,1].map(idx=>({
      idx,p:state.profiles[idx],
      s:state.workoutLog.filter(l=>l.userId===idx).reduce((a,l)=>a+(l.score||0),0),
      str:calcStreak(state.workoutLog.filter(l=>l.userId===idx)),
      sessions:state.workoutLog.filter(l=>l.userId===idx).length,
    })).sort((a,b)=>b.s-a.s);
    return(
      <div className="fade-up">
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:3,marginBottom:20}}>LEADERBOARD ⚔️</div>
        <Card style={{marginBottom:16,padding:"24px 20px",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
            {rows.map(({idx,p,s,str},rank)=>(
              <div key={idx} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:rank===0?T.accent:T.muted,letterSpacing:2,marginBottom:4}}>{p.nickname||`P${idx+1}`}</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,color:rank===0?T.accent:T.sub,lineHeight:1}}>{s}</div>
                <div style={{fontSize:11,color:T.muted}}>pts</div>
                <div style={{fontSize:13,color:T.muted,marginTop:8}}>🔥 {str} streak</div>
                <div style={{fontSize:12,color:T.muted}}>{rows.find(r=>r.idx===idx)?.sessions||0} sessions</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,fontSize:14,fontWeight:700,color:rows[0].s===rows[1].s?T.sub:rows[0].idx===activeUser?T.green:T.red}}>
            {rows[0].s===rows[1].s?"Dead even 🤝":rows[0].idx===activeUser?`You lead by ${rows[0].s-rows[1].s} pts 🏆`:`${rows[0].p.nickname} leads by ${rows[0].s-rows[1].s} pts — catch up!`}
          </div>
        </Card>
        {rows.map(({idx,p,s})=>{
          const ach=MILESTONES.filter(m=>m.score<=s);
          const next=MILESTONES.find(m=>m.score>s);
          return(
            <Card key={idx} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>{p.nickname||`P${idx+1}`}</div>
                <Pill label={`${s} pts`} color={T.accent}/>
              </div>
              {ach.length>0?(
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:next?12:0}}>
                  {ach.map(m=>(
                    <div key={m.score} style={{background:T.accent+"16",border:`1px solid ${T.accent}30`,borderRadius:10,padding:"6px 12px",textAlign:"center"}}>
                      <div style={{fontSize:18}}>{m.icon}</div>
                      <div style={{fontSize:10,fontWeight:700,color:T.accent,marginTop:2}}>{m.label}</div>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{fontSize:12,color:T.muted,marginBottom:next?12:0}}>Complete your first workout to unlock achievements!</div>
              )}
              {next&&(
                <div style={{padding:"10px 14px",background:T.surface,borderRadius:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontSize:12,color:T.muted}}>{next.icon} {next.label}</div>
                    <div style={{fontSize:12,color:T.accent,fontWeight:700}}>{next.score-s} pts away</div>
                  </div>
                  <div style={{background:T.faint,borderRadius:4,height:5,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,background:T.accent,width:`${Math.min(100,(s/next.score)*100)}%`,transition:"width 1s ease"}}/>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  /* ──────────────────────────────────────────
     HOME TAB
  ────────────────────────────────────────── */
  const HomeTab=()=>(
    <div className="fade-up">
      {!partnerWorkedToday&&!viewingPartner&&(
        <div style={{background:T.red+"14",border:`1px solid ${T.red}30`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.red}}>{partner.nickname||"Your partner"} hasn't trained today</div>
            <div style={{fontSize:12,color:T.muted}}>They might need a push...</div>
          </div>
          <Btn label="Nudge 📣" small onClick={()=>setShowNudge(true)} color={T.red}/>
        </div>
      )}
      {nudges4me.length>0&&!viewingPartner&&(
        <div style={{background:T.blue+"14",border:`1px solid ${T.blue}30`,borderRadius:12,padding:"12px 16px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.blue,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>📣 From {partner.nickname}</div>
          {nudges4me.map((n,i)=><div key={i} style={{fontSize:13,color:T.text,marginBottom:2}}>"{n.message}"</div>)}
        </div>
      )}
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        <Card style={{textAlign:"center",padding:"14px 10px"}}>
          <div style={{fontSize:34,lineHeight:1,display:"block"}}>🔥</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:T.accent,lineHeight:1}}>{viewStreak}</div>
          <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Streak</div>
        </Card>
        <Card style={{textAlign:"center",padding:"14px 10px"}} glow={T.accent}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:T.accent,lineHeight:1,marginTop:6}}>{viewScore}</div>
          <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Score</div>
        </Card>
        <Card style={{textAlign:"center",padding:"14px 10px"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:T.text,lineHeight:1,marginTop:6}}>{viewLogs.length}</div>
          <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Sessions</div>
        </Card>
      </div>
      {/* Partner view */}
      {viewingPartner&&(
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>{partner.nickname}'s STATS</div>
            <Pill label={partnerWorkedToday?"✓ Trained":"Rest Day"} color={partnerWorkedToday?T.green:T.muted}/>
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"center",padding:"12px 0",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,marginBottom:10}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:T.muted}}>You</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:myScore>=partnerScore?T.accent:T.sub}}>{myScore}</div>
            </div>
            <div style={{fontSize:22}}>⚔️</div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:T.muted}}>{partner.nickname}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:partnerScore>myScore?T.accent:T.sub}}>{partnerScore}</div>
            </div>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:myScore>partnerScore?T.green:myScore<partnerScore?T.red:T.sub,textAlign:"center"}}>
            {myScore>partnerScore?`You lead by ${myScore-partnerScore} pts 🏆`:myScore<partnerScore?`${partner.nickname} leads by ${partnerScore-myScore} pts — close the gap!`:"Dead even 🤝"}
          </div>
        </Card>
      )}
      {/* Milestones */}
      {achieved.length>0&&(
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Achievements</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:nextMilestone?12:0}}>
            {achieved.map(m=>(
              <div key={m.score} style={{background:T.accent+"16",border:`1px solid ${T.accent}30`,borderRadius:10,padding:"6px 12px",textAlign:"center"}}>
                <div style={{fontSize:20}}>{m.icon}</div>
                <div style={{fontSize:10,fontWeight:700,color:T.accent,marginTop:2}}>{m.label}</div>
              </div>
            ))}
          </div>
          {nextMilestone&&(
            <div style={{padding:"10px 14px",background:T.surface,borderRadius:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:12,color:T.muted}}>{nextMilestone.icon} {nextMilestone.label}</div>
                <div style={{fontSize:12,color:T.accent,fontWeight:700}}>{nextMilestone.score-viewScore} pts away</div>
              </div>
              <div style={{background:T.faint,borderRadius:4,height:5,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:4,background:T.accent,width:`${Math.min(100,(viewScore/nextMilestone.score)*100)}%`,transition:"width 1s ease"}}/>
              </div>
            </div>
          )}
        </Card>
      )}
      {/* Today's training */}
      {!viewingPartner&&(
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>TODAY'S TRAINING</div>
            {workedOutToday&&<Pill label="✓ Done!" color={T.green}/>}
          </div>
          <div style={{fontSize:12,color:T.muted,marginBottom:12}}>
            {GOALS.find(g=>g.id===me.goal)?.icon} {GOALS.find(g=>g.id===me.goal)?.label}
            {anyCycleActive&&<span style={{color:T.phase[activeCyclePhase],marginLeft:8}}>· Cycle Adapted</span>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["upper","Upper Body","💪"],["lower","Lower Body","🦵"],["core","Core","🔥"],["cardio","Walk / Run","🏃"]].map(([k,l,icon])=>(
              <button key={k} onClick={()=>{setWorkoutSplit(k);setWorkoutIsCustom(false);setScreen("workout");}} style={{padding:"16px 14px",borderRadius:12,border:`1.5px solid ${splitColors[k]}40`,background:T.surface,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{l}</div>
                <div style={{fontSize:10,color:splitColors[k],marginTop:4,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:700}}>{PROGRAMS[me.goal]?.[k]?.length||0} exercises</div>
              </button>
            ))}
          </div>
          {state.customWorkouts.length>0&&(
            <div style={{marginTop:14}}>
              <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,marginBottom:8}}>Custom</div>
              {state.customWorkouts.map(cw=>(
                <button key={cw.id} onClick={()=>{setWorkoutSplit(cw.id);setWorkoutIsCustom(true);setScreen("workout");}} style={{display:"flex",width:"100%",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,border:`1.5px solid ${T.orange}40`,background:T.surface,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:8}}>
                  <span style={{fontSize:22}}>{cw.icon||"🏋️"}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text}}>{cw.name}</div>
                    <div style={{fontSize:10,color:T.orange,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:700,marginTop:2}}>{cw.exercises.length} exercises</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
      {/* Recent sessions */}
      {viewLogs.length>0&&(
        <Card style={{marginBottom:14}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,marginBottom:12}}>
            {viewingPartner?`${partner.nickname}'s `:""}RECENT SESSIONS
          </div>
          {viewLogs.slice(0,5).map((log,i)=>{
            const cw2=log.isCustom?state.customWorkouts.find(w=>w.id===log.split):null;
            const label=log.isCustom?(cw2?.icon||"🏋️")+" "+(cw2?.name||"Custom"):({upper:"Upper Body",lower:"Lower Body",core:"Core",cardio:"Walk/Run"}[log.split]||log.split);
            return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<Math.min(viewLogs.length,5)-1?`1px solid ${T.border}`:"none"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600}}>{label}</div>
                  <div style={{fontSize:12,color:T.muted}}>{log.date}</div>
                </div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:T.accent}}>+{log.score}</div>
              </div>
            );
          })}
        </Card>
      )}
      {/* Check-ins */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>CHECK-INS</div>
          {!viewingPartner&&<Btn label="+ Post" small onClick={()=>setShowCheckin(true)} color={T.green}/>}
        </div>
        {state.checkins.length===0&&<div style={{fontSize:13,color:T.muted,textAlign:"center",padding:"16px 0"}}>No check-ins yet — share how training is going!</div>}
        {state.checkins.slice(0,6).map((c,i)=>{
          const who=state.profiles[c.userId];
          return(
            <div key={i} style={{padding:"11px 0",borderBottom:i<Math.min(state.checkins.length,6)-1?`1px solid ${T.border}`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:c.userId===activeUser?T.accent:T.blue,marginBottom:4,letterSpacing:"0.05em"}}>{who?.nickname||`P${c.userId+1}`}</div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.5}}>{c.message}</div>
                </div>
                <button onClick={()=>setState(p=>({...p,checkins:p.checkins.map((cx,ci)=>ci===i?{...cx,likes:cx.likes.includes(activeUser)?cx.likes.filter(x=>x!==activeUser):[...cx.likes,activeUser]}:cx)}))} style={{background:"transparent",border:"none",color:c.likes.includes(activeUser)?T.red:T.muted,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:700,marginLeft:10}}>
                  ♥ {c.likes.length}
                </button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );

  /* ──────────────────────────────────────────
     ROOT LAYOUT
  ────────────────────────────────────────── */
  return(
    <div style={{background:T.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:T.text,maxWidth:540,margin:"0 auto"}}>
      <FontLoader/>

      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#0f0f0f",padding:"11px 22px",borderRadius:50,fontWeight:700,fontSize:14,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}} className="pop-in">
          {toast.msg}
        </div>
      )}

      {/* Nudge modal */}
      {showNudge&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:24}}>
          <div style={{background:T.card,borderRadius:20,padding:28,width:"100%",maxWidth:400,border:`1px solid ${T.border}`}} className="pop-in">
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,marginBottom:4}}>NUDGE {(partner.nickname||"Partner").toUpperCase()}</div>
            <div style={{color:T.muted,fontSize:13,marginBottom:18}}>Send them a little push 👀</div>
            <textarea value={nudgeMsg} onChange={e=>setNudgeMsg(e.target.value)} placeholder={`Hey ${partner.nickname||"partner"}, get moving! 💪`} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14,color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:14,height:80,outline:"none",marginBottom:14}}/>
            <div style={{display:"flex",gap:10}}>
              <Btn label="Cancel" outline full onClick={()=>setShowNudge(false)} color={T.muted}/>
              <Btn label="Send 📣" full onClick={()=>{const msg=nudgeMsg.trim()||`Hey ${partner.nickname||"partner"}, get moving! 💪`;setState(p=>({...p,nudges:[{from:activeUser,to:partnerId,message:msg,timestamp:Date.now()},...p.nudges]}));setNudgeMsg("");setShowNudge(false);showToast(`Nudge sent to ${partner.nickname}! 📣`,T.blue);}}/>
            </div>
          </div>
        </div>
      )}

      {/* Checkin modal */}
      {showCheckin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:24}}>
          <div style={{background:T.card,borderRadius:20,padding:28,width:"100%",maxWidth:400,border:`1px solid ${T.border}`}} className="pop-in">
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,marginBottom:4}}>CHECK-IN</div>
            <div style={{color:T.muted,fontSize:13,marginBottom:18}}>Share how you're feeling with your partner.</div>
            <textarea value={checkinMsg} onChange={e=>setCheckinMsg(e.target.value)} placeholder="Crushed legs today. Knees are jelly 🦵🔥" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14,color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:14,height:80,outline:"none",marginBottom:14}}/>
            <div style={{display:"flex",gap:10}}>
              <Btn label="Cancel" outline full onClick={()=>setShowCheckin(false)} color={T.muted}/>
              <Btn label="Post ✓" full onClick={()=>{if(checkinMsg.trim()){setState(p=>({...p,checkins:[{userId:activeUser,message:checkinMsg.trim(),timestamp:Date.now(),likes:[]},...p.checkins]}));setCheckinMsg("");setShowCheckin(false);showToast("Check-in posted! ✓",T.green);}}} color={T.green}/>
            </div>
          </div>
        </div>
      )}

      {/* Top nav */}
      <div style={{padding:"18px 18px 0",background:T.bg,position:"sticky",top:0,zIndex:10,borderBottom:`1px solid ${T.border}`,paddingBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:T.accent,letterSpacing:4}}>DUO FIT</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {(p0.gender==="female"||p1.gender==="female")&&(
              <button onClick={()=>upd("cycleGlobalEnabled",!state.cycleGlobalEnabled)} style={{background:state.cycleGlobalEnabled?T.phase.menstrual+"18":"transparent",border:`1px solid ${state.cycleGlobalEnabled?T.phase.menstrual:T.border}`,borderRadius:20,padding:"5px 12px",color:state.cycleGlobalEnabled?T.phase.menstrual:T.muted,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                🌙 Cycle {state.cycleGlobalEnabled?"ON":"OFF"}
              </button>
            )}
            <button onClick={()=>{setActiveUser(activeUser===0?1:0);setViewingPartner(false);}} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"5px 14px",color:T.text,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>
              →{partner.nickname||"P2"}
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{l:`Me (${me.nickname||"You"})`,v:false},{l:`${partner.nickname||"Partner"} 👥`,v:true}].map(({l,v})=>(
            <button key={String(v)} onClick={()=>setViewingPartner(v)} style={{flex:1,padding:"9px 10px",borderRadius:10,border:`1.5px solid ${viewingPartner===v?T.accent:T.border}`,background:viewingPartner===v?T.accentFaint:"transparent",color:viewingPartner===v?T.accent:T.muted,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"18px 16px 100px"}}>
        {tab==="home"&&<HomeTab/>}
        {tab==="schedule"&&<ScheduleTab/>}
        {tab==="builder"&&<BuilderTab/>}
        {tab==="board"&&<BoardTab/>}
      </div>

      <BottomNav tab={tab} setTab={setTab}/>
    </div>
  );
}
