import React, { useState, useEffect, cloneElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
  Home, Map, Layers, Clock, FileText, Headphones,
  ChevronDown, Search, Bell, Activity, ArrowUp, ArrowDown,
  Wind, Droplets, Zap, Volume2, Leaf, Thermometer,
  ArrowUpRight, AlertTriangle, CloudRain, Minus, ArrowLeft, Menu,
  MapPin, RotateCw, Loader2,
  Check, Sun, Droplet, Factory, ArrowDownRight, ArrowUpLeft, Play,
  Wifi, ShieldAlert, BatteryFull, BatteryMedium, BatteryLow, Battery, Circle, CheckCircle2, XCircle
} from 'lucide-react';

const customMarkerIcon = new L.DivIcon({
  className: 'custom-map-icon',
  html: `<div style="background-color: #7bc341; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(123, 195, 65, 0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
}

export default function App() {
  const [authState, setAuthState] = useState<'login' | 'register' | 'authenticated'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  return (
    <AnimatePresence mode="wait">
      {authState === 'login' && (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <LoginView onLogin={() => setAuthState('authenticated')} onNavigateRegister={() => setAuthState('register')} />
        </motion.div>
      )}
      {authState === 'register' && (
        <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <RegisterView onRegister={() => setAuthState('authenticated')} onNavigateLogin={() => setAuthState('login')} />
        </motion.div>
      )}
      {authState === 'authenticated' && (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-screen bg-[#fafafa] text-[#333] font-sans" dir="rtl">
      {/* Toast Notification */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-[#1e293b] text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#86ca86]" />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      </div>

      {/* Top Navbar */}
      <nav className="h-[72px] bg-white border-b border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10 object-contain" />
          </div>

          <div className="hidden md:flex gap-8 px-4 text-[15px] font-bold text-gray-700 h-[72px]">
            <a href="#" className="h-full flex items-center text-[#5EA15E] relative">
              الرئيسية
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5EA15E] rounded-t-lg"></div>
            </a>
            <a href="#" className="h-full flex items-center hover:text-[#5EA15E] transition-colors">عن المنصة</a>
            <a href="#" className="h-full flex items-center hover:text-[#5EA15E] transition-colors gap-1">
              خدماتنا
              <ChevronDown className="w-4 h-4 text-gray-400 stroke-[3]" />
            </a>
            <a href="#" className="h-full flex items-center hover:text-[#5EA15E] transition-colors">الأسئلة الشائعة</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-[14px] font-bold text-gray-700 hover:text-gray-900 transition">
            <span className="font-bold flex items-center gap-1">
              English
              <LanguageIcon />
            </span>
          </button>

          <div className="h-6 w-px bg-gray-200"></div>

          <div className="relative">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowUserMenu(v => !v)}
            >
              <span className="text-sm font-bold text-gray-800">صلاح عبدالله</span>
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[#5EA15E] text-xs">
                AB
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>
            {showUserMenu && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-[13px] font-black text-gray-900">صلاح عبدالله</p>
                  <p className="text-[11px] font-medium text-gray-500">salah@wazen.sa</p>
                </div>
                <button className="w-full px-4 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                  <Activity className="w-4 h-4" />
                  الملف الشخصي
                </button>
                <button
                  onClick={() => { setAuthState('login'); setShowUserMenu(false); }}
                  className="w-full px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition border-t border-gray-100"
                >
                  <XCircle className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex w-full mx-auto max-w-[1600px] h-[calc(100vh-72px)] overflow-hidden">
        {/* Right Sidebar */}
        <aside className="w-[260px] bg-[#f8f9fa] border-l border-gray-100 flex-shrink-0 pt-8 px-4 overflow-y-auto hidden lg:block">
          <nav className="flex flex-col gap-1.5">
            <SidebarItem icon={<Home className="w-5 h-5" />} label="لوحة التحكم" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={<Map className="w-5 h-5" />} label="تحليل الأرض" active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
            <SidebarItem icon={<Layers className="w-5 h-5" />} label="المحاكاة" active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} />
            <SidebarItem icon={<Clock className="w-5 h-5" />} label="المراقبة" active={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')} />
            <SidebarItem icon={<FileText className="w-5 h-5" />} label="التقارير" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
            <SidebarItem icon={<Headphones className="w-5 h-5" />} label="مركز المساعدة" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <DashboardView showToast={showToast} />}
              {activeTab === 'analysis' && <AnalysisView showToast={showToast} />}
              {activeTab === 'simulation' && <SimulationView showToast={showToast} />}
              {activeTab === 'monitoring' && <MonitoringView showToast={showToast} />}
              {activeTab === 'reports' && <ReportsView showToast={showToast} />}
              {activeTab === 'help' && <HelpView showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ----------------------------------------------------
// UI Components
// ----------------------------------------------------

function LogoIcon({ className }: { className?: string }) {
  return (
    <img src="/icon.png" alt="Wazen Logo" className={className} />
  );
}

function LanguageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

function SectionHead({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5EA15E]"></div>
        <span className="text-[13px] font-bold text-gray-700">{title}</span>
      </div>
      <h3 className="text-[18px] font-bold text-gray-900">{subtitle}</h3>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }} className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all font-bold text-[15px] ${active
      ? 'bg-[#eef8ed] text-[#5EA15E]'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}>
      <span className="text-current">{icon}</span>
      <span>{label}</span>
      {active && <div className="absolute right-0 w-1 h-8 bg-[#5EA15E] rounded-l-full"></div>}
    </a>
  );
}

function DashboardHeader({ showToast }: { showToast: (m: string) => void }) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
      <div className="flex-1 w-full flex flex-col items-start gap-2 order-1">
        <h1 className="text-[28px] font-bold text-[#1e293b] leading-none mb-1">لوحة التحكم</h1>

        <div className="flex flex-col items-start">
          <p className="text-gray-400 font-medium text-[14px] mb-1">النظام التشغيلي البيئي</p>
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold text-[#334155] leading-none">النظرة العامة</h2>
            <div className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5EA15E] animate-pulse"></div>
              <span className="text-[11px] text-gray-600 font-semibold">مباشر</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap w-full xl:w-auto justify-start xl:justify-end order-2">
        {['3 أشهر', '30 يوم', 'آخر 7 أيام'].map(label => (
          <button key={label} className="px-4 py-2 rounded-xl border border-gray-100 text-gray-500 text-[13px] font-medium bg-white hover:bg-gray-50 transition shadow-sm">
            {label}
          </button>
        ))}
        <button className="px-4 py-2 rounded-xl border border-[#5EA15E]/30 text-[#5EA15E] text-[13px] font-semibold bg-white hover:bg-[#f4faf4] flex items-center justify-center transition shadow-sm">
          آخر 24 ساعة
        </button>
        <button onClick={() => showToast('جاري التصدير...')} className="px-5 py-2 rounded-xl border border-gray-100 text-gray-700 text-[13px] font-bold bg-white hover:bg-gray-50 flex items-center gap-2 transition shadow-sm mr-2 border-r border-[#eaecf0]">
          <FileText className="w-4 h-4 text-gray-400" />
          تصدير التقرير
        </button>
      </div>
    </div>
  );
}

function KpiCard({ title, value, unit, icon, pillText, pillIcon }: { title: string, value: string, unit?: string, icon: React.ReactNode, pillText: string, pillIcon?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[24px] p-5 border border-gray-100 flex flex-col min-h-[160px] shadow-[0_2px_12px_rgba(0,0,0,0.01)] relative group hover:shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="flex justify-between items-start mb-1">
        <div className="w-[48px] h-[48px] rounded-[16px] bg-[#f4fbf4] flex items-center justify-center text-[#5EA15E] shadow-sm border border-white">
          {cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-gray-100 px-2.5 py-1 rounded-full">
          {pillIcon && <span className="text-[#64748b]">{pillIcon}</span>}
          <span className="text-[11px] font-semibold text-[#64748b]" dir="ltr">{pillText}</span>
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 justify-center mt-3">
        <span className="text-[15px] font-medium text-[#64748b] mb-1 text-center leading-tight">{title}</span>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-[28px] font-bold text-[#1e293b] tracking-tight" dir="ltr">{value}</span>
          {unit && <span className="text-[13px] font-semibold text-[#94a3b8] mb-1">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function HealthIndexCard() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 h-full w-full shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex flex-col gap-0.5 mb-2">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[14px] font-medium text-[#64748b]">الصحة البيئية</span>
            <div className="w-2 h-2 rounded-full bg-[#065f46]"></div>
          </div>
          <h3 className="text-[16px] font-bold text-[#1e293b] text-right">المؤشر المركب للبيئة والسلامة</h3>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc]/30 p-6 pt-2">
        <div className="relative w-[180px] h-[180px] flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-[220deg]">
            <circle cx="90" cy="90" r="75" fill="none" stroke="#f1f5f9" strokeWidth="16" strokeDasharray="471" />
            <circle cx="90" cy="90" r="75" fill="none" stroke="#65a34e" strokeWidth="16" strokeDasharray="471" strokeDashoffset="310" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[44px] font-bold text-[#1e293b] leading-none mb-0.5">30</span>
            <span className="text-gray-400 font-semibold text-[15px]">من 100</span>
          </div>
        </div>
        <div className="text-[12px] font-semibold text-[#ef4444] mt-5 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100" dir="ltr">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="rotate-[135deg]"><path d="m19 12-7 7-7-7" /><path d="M12 19V5" /></svg>
          4.2- مقارنة بالربع الماضي
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 bg-white border-t border-gray-50">
        <ProgressBar label="الهواء" value={65} color="bg-amber-500" pct="65%" />
        <ProgressBar label="المياه" value={71} color="bg-emerald-500" pct="71%" />
        <ProgressBar label="الكربون" value={62} color="bg-amber-500" pct="62%" />
        <ProgressBar label="التنوع الحيوي" value={88} color="bg-emerald-500" pct="88%" />
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color, pct }: { label: string, value: number, color: string, pct: string }) {
  return (
    <div className="flex flex-col gap-2 p-5 rounded-2xl border border-gray-50 bg-[#fafbfc] hover:border-gray-200 transition-all">
      <div className="flex justify-between items-center text-[13px] font-medium">
        <span className="text-gray-400" dir="ltr">{pct}</span>
        <span className="text-[#334155]">{label}</span>
      </div>
      <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-[1500ms] ease-out`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 h-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] flex flex-col relative overflow-hidden min-h-[400px]">
      <div className="absolute top-6 left-6 z-[400]">
        <button className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
          الطبقات
          <Layers className="w-4 h-4 ml-1" />
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <SectionHead title="نظم المعلومات الجغرافية" subtitle="خريطة التحليل الذكي للموقع" />

      <div className="mt-4 flex-1 w-full bg-[#fcfdfc] rounded-2xl relative border border-gray-100 flex items-center justify-center overflow-hidden">
        <MapContainer
          center={[24.7136, 46.6753]}
          zoom={12}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri"
          />
          <Marker position={[24.7136, 46.6753]} icon={customMarkerIcon}>
            <Popup>القطاع أ - مشروع الرياض</Popup>
          </Marker>
          <Marker position={[24.7336, 46.7053]} icon={customMarkerIcon}>
            <Popup>القطاع ب - حي العليا</Popup>
          </Marker>
          <Marker position={[24.6936, 46.6253]} icon={customMarkerIcon}>
            <Popup>القطاع ج - تسرب مياه (خطر)</Popup>
          </Marker>
        </MapContainer>

        <div className="absolute right-4 bottom-4 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white shadow-sm z-[400]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
            <span className="text-[11px] font-bold text-gray-700">مرتفع</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>
            <span className="text-[11px] font-bold text-gray-700">متوسط</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#84cc16]"></div>
            <span className="text-[11px] font-bold text-gray-700">منخفض</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveAlertsCard() {
  const alerts = [
    { title: "اكتشاف تسرب مياه", sub: "القطاع هـ . المياه", time: "قبل 2د", icon: <Droplets className="w-5 h-5 text-rose-500" />, bg: "bg-rose-50" },
    { title: "يتجاوز الحد PM10", sub: "القطاع أ - منطقة الإنشاء", time: "قبل 2د", icon: <Wind className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50" },
    { title: "ارتفاع ضوضاء", sub: "القطاع ج - النافذة الليلية", time: "قبل 2د", icon: <Volume2 className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50" },
    { title: "اكتشاف مسح الطائرة", sub: "المحمية - التنوع الحيوي", time: "قبل 2د", icon: <Leaf className="w-5 h-5 text-[#5EA15E]" />, bg: "bg-[#f0f9f0]" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 h-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] flex flex-col justify-between">
      <div>
        <SectionHead title="تنبيهات مباشرة" subtitle="تدفق الحوادث" />

        <div className="flex flex-col mt-4 gap-1">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 relative">
              <div className="flex items-center gap-3 w-full">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${alert.bg}`}>
                  {alert.icon}
                </div>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <span className="text-[13px] font-bold text-gray-900">{alert.title}</span>
                  <span className="text-[11px] font-bold text-gray-500">{alert.sub}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-start mt-1">
                <span className="text-[10px] font-bold text-gray-400">{alert.time}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-2 text-[13px] font-black text-gray-700 hover:text-[#5EA15E] transition py-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100">
        عرض كل التنبيهات
        <ArrowLeft className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}

function AirQualityCard() {
  const data = [
    { name: '1', pm25: 35, pm10: 15 },
    { name: '2', pm25: 42, pm10: 22 },
    { name: '3', pm25: 38, pm10: 18 },
    { name: '4', pm25: 45, pm10: 20 },
    { name: '5', pm25: 55, pm10: 25 },
    { name: '6', pm25: 58, pm10: 22 },
    { name: '7', pm25: 68, pm10: 28 },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 h-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] flex flex-col relative overflow-hidden">
      <SectionHead title="جودة الهواء" subtitle="ميكروغرام/م³ PM2.5 / PM10" />

      <div className="absolute left-6 top-6 flex items-center gap-1.5 bg-[#f4faf4] px-2.5 py-1 rounded-md">
        <ArrowUpRight className="w-3.5 h-3.5 text-[#5EA15E] stroke-[3]" />
        <span className="text-[11px] font-bold text-[#5EA15E]">خلال 24س</span>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-[44px] font-bold text-gray-900 leading-none">42</span>
            <span className="text-[12px] font-bold text-gray-400">مؤشر جيد</span>
          </div>
          <div className="flex flex-col gap-0.5 mt-2">
            <span className="text-[11px] font-bold text-gray-500">مقارنة بالشهر الماضي</span>
            <span className="text-[#5EA15E] flex items-center text-[13px] font-bold" dir="ltr">
              <ArrowUp className="w-3 h-3 mr-0.5" /> 100%
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[160px] relative mt-2 -mx-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7bc341" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#7bc341" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: 'rtl' }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: '#7bc341', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }}
            />
            <Area activeDot={{ r: 6, fill: '#7bc341', stroke: '#fff', strokeWidth: 2 }} type="monotone" dataKey="pm25" stroke="#7bc341" strokeWidth={3} fillOpacity={1} fill="url(#colorPm25)" />
            <Area activeDot={{ r: 5, fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }} type="monotone" dataKey="pm10" stroke="#1e293b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AiRecommendationCard() {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 h-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] flex flex-col justify-between relative">
      <div>
        <SectionHead title="الذكاء الاصطناعي" subtitle="التوصية" />

        <p className="text-[15px] font-semibold text-gray-700 leading-normal mt-4 text-center">
          استبدال الإسمنت منخفض الكربون في القطاعين ب و هـ يقلل CO₂ المتوقع بنحو <span className="text-[#7bc341] font-bold">18,400</span> طن خلال مرحلة البناء مع إبقاء انزياح الجدول دون 4 أيام.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <button className="bg-[#7bc341] hover:bg-[#68a636] text-white font-bold py-2.5 rounded-xl transition text-[14px]">
            تطبيق المقترح
          </button>
          <button className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 font-bold py-2.5 rounded-xl transition text-[14px]">
            عرض بدائل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mt-8">
        <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <span className="text-gray-400 font-bold text-[10px] mb-0.5">الموثوقية</span>
          <span className="text-[15px] font-bold text-gray-900 flex items-center gap-0.5" dir="ltr">98<span className="text-[10px] text-gray-500 font-bold">%</span></span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <span className="text-gray-400 font-bold text-[10px] mb-0.5">التكلفة</span>
          <span className="text-[15px] font-bold text-gray-900 flex items-center gap-0.5" dir="ltr">+2.1<span className="text-[10px] text-gray-500 font-bold">%</span></span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <span className="text-gray-400 font-bold text-[10px] mb-0.5">CO₂</span>
          <span className="text-[15px] font-bold text-gray-900 flex items-center gap-0.5" dir="ltr">-18.4 <span className="text-[9px] text-gray-500 font-bold">ل.ط</span></span>
        </div>
      </div>
    </div>
  );
}

function CarbonFootprintCard() {
  const data = [
    { name: '1', current: 40, target: 25 },
    { name: '2', current: 65, target: 40 },
    { name: '3', current: 35, target: 20 },
    { name: '4', current: 45, target: 30 },
    { name: '5', current: 60, target: 45 },
    { name: '6', current: 55, target: 35 },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 h-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] flex flex-col justify-between">
      <SectionHead title="البصمة الكربونية" subtitle="ميكروغرام/م³ PM2.5 / PM10" />

      <div className="flex flex-col items-center mt-2">
        <div className="flex items-baseline gap-1.5" dir="ltr">
          <span className="text-[44px] font-bold text-gray-900 leading-[1]">660</span>
          <span className="text-[18px] font-bold text-gray-600 mb-1">ط</span>
        </div>
        <p className="text-gray-400 text-[12px] font-bold mt-1">الانبعاثات الفعلية في شهر صفر</p>
        <div className="flex items-center gap-1.5 mt-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50">
          <ArrowDown className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-rose-500 text-[12px] font-bold">-40%</span>
          <span className="text-gray-700 text-[12px] font-bold">تقليل استهلاك/تلوث</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[140px] mt-6">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: 'rtl' }}
              cursor={{ fill: 'rgba(123, 195, 65, 0.05)' }}
            />
            <Bar dataKey="current" fill="#f1f5f9" radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="target" fill="#7bc341" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function WhatIfCard({ showToast }: { showToast: (m: string) => void }) {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 w-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] relative flex flex-col">
      <div className="absolute left-6 top-6">
        <button onClick={() => showToast('جاري إنشاء سيناريو جديد...')} className="bg-[#65a34e] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-[12px] font-bold shadow-sm hover:bg-[#589542] transition border border-[#508b3c]/20">
          <PlusCircle className="w-3.5 h-3.5" />
          سيناريو جديد
        </button>
      </div>

      <SectionHead title="بيئة التحليل والمحاكاة" subtitle="سيناريوهات ماذا لو" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 flex-1">
        <ScenarioCol
          title="أ الخطة الأساسية"
          v1={{ label: "الكربون", val: 1100, unit: "ط", pct: 90 }}
          v2={{ label: "المياه", val: 84, unit: "م.متر", pct: 70 }}
          v3={{ label: "الطاقة", val: 920, unit: "م.و.س", pct: 85 }}
        />
        <ScenarioCol
          title="ب طاقة شمسية + مياه رمادية"
          aiTag
          v1={{ label: "الكربون", val: 740, unit: "ط", pct: 60, color: "bg-[#5EA15E]" }}
          v2={{ label: "المياه", val: 52, unit: "م.لتر", pct: 40, color: "bg-[#84cc16]" }}
          v3={{ label: "الطاقة", val: 680, unit: "م.و.س", pct: 55, color: "bg-[#5EA15E]" }}
        />
        <ScenarioCol
          title="ج بناء معياري"
          v1={{ label: "الكربون", val: 820, unit: "ط", pct: 65 }}
          v2={{ label: "المياه", val: 66, unit: "م.لتر", pct: 55 }}
          v3={{ label: "الطاقة", val: 740, unit: "م.و.س", pct: 70 }}
        />
      </div>
    </div>
  );
}

function ScenarioCol({ title, aiTag, v1, v2, v3 }: any) {
  return (
    <div className={`rounded-xl border ${aiTag ? 'border-[#5EA15E] bg-[#fcfdfc]' : 'border-gray-200 bg-white'} p-6 flex flex-col gap-6 relative shadow-sm`}>
      {aiTag && (
        <div className="absolute top-4 left-4 bg-[#f4faf4] text-[#5EA15E] px-2.5 py-1 rounded flex items-center gap-1.5 text-[10px] font-bold shadow-sm border border-[#5EA15E]/20">
          <Zap className="w-3 h-3 fill-[#5ea15e] text-[#5ea15e]" /> اختيار الذكاء
        </div>
      )}
      <h4 className="text-gray-900 font-bold text-[16px]">{title}</h4>

      <div className="flex flex-col gap-5">
        <ScenarioBar {...v1} />
        <ScenarioBar {...v2} />
        <ScenarioBar {...v3} />
      </div>
    </div>
  );
}

function ScenarioBar({ label, val, unit, pct, color = "bg-gray-800" }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[12px] font-bold text-gray-600">{label}</span>
        <span className="text-[12px] font-bold text-gray-900 flex gap-1" dir="ltr">{val} <span className="text-[10px] text-gray-500 font-bold">{unit}</span></span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

function PlusCircle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

function ComplianceCard({ showToast }: { showToast: (m: string) => void }) {
  const items = [
    { label: "معيار جودة الهواء - MOEN", status: "ممتثل", color: "text-[#5EA15E] border border-[#a2d8a2] bg-[#f4faf4]" },
    { label: "تقارير GRESB للحوكمة البيئية", status: "ممتثل", color: "text-[#5EA15E] border border-[#a2d8a2] bg-[#f4faf4]" },
    { label: "المبادرة السعودية الخضراء", status: "إجراءات مستعجلة", color: "text-[#f97316] border border-[#fbd38d] bg-[#fff7ed]" },
    { label: "الالتزام البيئي", status: "ممتثل", color: "text-[#5EA15E] border border-[#a2d8a2] bg-[#f4faf4]" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-200 w-full shadow-[0_2px_10px_rgba(0,0,0,0.015)] relative flex flex-col">
      <div className="absolute left-6 top-6">
        <button onClick={() => showToast('جاري تصدير ESG...')} className="bg-[#65a34e] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[12px] font-bold shadow-sm hover:bg-[#589542] transition border border-[#508b3c]/20">
          <FileText className="w-3.5 h-3.5" />
          تصدير ESG
        </button>
      </div>

      <SectionHead title="الجهات التنظيمية" subtitle="حالة الامتثال" />

      <div className="mt-6 flex flex-col rounded-2xl overflow-hidden divide-y divide-gray-100 flex-1 border border-gray-100">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-5 px-5 bg-white">
            <span className="text-[14px] font-black text-gray-800 relative pl-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#5ea15e] before:absolute before:right-[-14px] before:top-1/2 before:-translate-y-1/2 mr-4">{item.label}</span>
            <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${item.color}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantCard() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setMessages([...newMessages, { role: 'model', content: data.text }]);
      } else if (data.error) {
        setMessages([...newMessages, { role: 'model', content: data.error }]);
      } else {
        setMessages([...newMessages, { role: 'model', content: 'حدث خطأ غير متوقع' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', content: 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f6fbf6] to-[#fcfdfc] border-[1px] border-[#e1ece1] rounded-[24px] p-8 flex flex-col relative shadow-sm overflow-hidden mb-6 min-h-[550px]">
      <div className="absolute top-0 right-0 left-0 h-[150px] bg-gradient-to-b from-[#eaf5eb]/50 to-transparent pointer-events-none"></div>

      <div className="flex items-start gap-4 mb-8 z-10 w-full">
        <div className="w-12 h-12 rounded-full bg-[#7bc341] flex items-center justify-center shadow-lg shadow-[#7bc341]/20 shrink-0">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <div className="flex flex-col mt-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[15px] font-bold text-gray-800">مساعدك الذكي</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5ea15e] animate-pulse"></span>
          </div>
          <p className="text-[15px] font-semibold text-gray-500 leading-relaxed max-w-[85%]">
            أهلاً بك، أنا مساعدك البيئي الذكي في منصة نامي. أنا هنا لمساعدتك في التحليل البيئي والامتثال للمعايير، يمكنك اختيار أحد الاقتراحات في الأسفل أو طرح سؤالك مباشرة.
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full mx-auto z-10 mb-8 max-w-[900px] self-end xl:self-auto xl:mr-16">
          <div onClick={() => handleSend("حلل لي مؤشرات الموقع البيئية")} className="cursor-pointer">
            <AssistantOptionCard
              icon={<Activity className="w-5 h-5 text-[#86ca86]" />}
              title="حلل مؤشرات الموقع"
              desc="يعرض مؤشرات بيئية تساعد على فهم حالة البيئة في المنطقة"
            />
          </div>
          <div onClick={() => handleSend("توقع التغيرات القادمة بناءً على البيانات الحالية")} className="cursor-pointer">
            <AssistantOptionCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-[#86ca86]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>}
              title="توقع التغيرات القادمة"
              desc="عملية تحليل تهدف إلى تحديد وتقدير التأثيرات البيئية المحتملة"
            />
          </div>
          <div onClick={() => handleSend("قم بتقييم المخاطر البيئية لمشروع جديد")} className="cursor-pointer">
            <AssistantOptionCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-[#86ca86]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>}
              title="تقييم المخاطر البيئية"
              desc="تحديد وتحليل التأثيرات البيئية المحتملة للأنشطة أو المشاريع"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full max-w-[1200px] z-10 flex flex-col gap-4 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-[#7bc341] text-white rounded-tl-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tr-sm shadow-sm'}`}>
                <div className="text-[14px] font-bold leading-relaxed whitespace-pre-wrap md-content">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-800 rounded-tr-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7bc341] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#7bc341] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#7bc341] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-[1200px] z-10 relative mt-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputValue);
          }}
          placeholder="اكتب رسالتك للمساعد الذكي..."
          className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full py-4 px-8 pr-6 text-[15px] font-bold text-gray-800 shadow-sm focus:outline-none focus:border-[#5EA15E] focus:bg-white transition-colors"
        />
        <button
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim() || isLoading}
          className="absolute left-2.5 top-2.5 bottom-2.5 w-11 bg-[#8dc859] hover:bg-[#7ebd4e] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition shadow-sm"
        >
          <ArrowUp className="w-5 h-5 text-white" strokeWidth={3} />
        </button>
      </div>

    </div>
  );
}

function AssistantOptionCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white/90 backdrop-blur-md border text-center border-gray-200 hover:border-[#5EA15E]/40 rounded-[20px] p-5 cursor-pointer transition shadow-sm hover:shadow-md flex flex-col items-center">
      <div className="mb-3">
        {icon}
      </div>
      <h5 className="font-bold text-[14px] text-gray-900 mb-1.5">{title}</h5>
      <p className="text-[12px] font-bold text-gray-500 leading-relaxed max-w-[220px]">{desc}</p>
    </div>
  );
}

function AnalysisView() {
  const [layers, setLayers] = useState({
    landUse: true,
    vegetation: true,
    elevation: false,
    soilType: false,
  });

  const [mapCenter, setMapCenter] = useState<[number, number]>([24.7136, 46.6753]);
  const [mapZoom, setMapZoom] = useState(14);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState({
    suitability: { value: "87/100", subValue: "+4.2%", icon: <Activity className="w-5 h-5 text-[#86ca86]" />, bg: "bg-[#f4fbf4]", color: "text-[#7bc341]", dot: "bg-[#1e293b]", type: "text" },
    risks: { value: "منخفضة", subValue: "مستقر", icon: <AlertTriangle className="w-5 h-5 text-[#86ca86]" />, bg: "bg-[#f4fbf4]", color: "text-[#7bc341]", type: "badge", dot: "bg-[#065f46]" },
    constraints: { value: "3 بنود", subValue: "-1", icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, bg: "bg-[#fffbeb]", color: "text-amber-500", dot: "bg-[#1e293b]", type: "text" },
    tilt: { value: "6.4%", subValue: "متوسط", icon: <Activity className="w-5 h-5 text-[#86ca86]" />, bg: "bg-[#f4fbf4]", color: "text-[#7bc341]", dot: "bg-[#1e293b]", type: "text" },
    ndvi: { value: "0.42NDVI", subValue: "0.03", icon: <Leaf className="w-5 h-5 text-[#86ca86]" />, bg: "bg-[#f4fbf4]", color: "text-[#7bc341]", dot: "bg-[#1e293b]", type: "text" }
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const suitabilityVal = Math.floor(Math.random() * (95 - 75 + 1) + 75);
      const risksVal = ["منخفضة", "متوسطة", "عالية"][Math.floor(Math.random() * 3)];
      const constraintsVal = Math.floor(Math.random() * 5) + 1;
      const tiltVal = (Math.random() * 10 + 2).toFixed(1);
      const ndviVal = (Math.random() * 0.4 + 0.3).toFixed(2);

      setInsights(prev => ({
        ...prev,
        suitability: { ...prev.suitability, value: `${suitabilityVal}/100`, subValue: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 5).toFixed(1) + '%' },
        risks: {
          ...prev.risks,
          value: risksVal,
          icon: risksVal === 'عالية' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <AlertTriangle className="w-5 h-5 text-[#86ca86]" />,
          bg: risksVal === 'عالية' ? "bg-red-50" : "bg-[#f4fbf4]",
          dot: risksVal === 'عالية' ? "bg-red-600" : "bg-[#065f46]"
        },
        constraints: { ...prev.constraints, value: `${constraintsVal} بنود` },
        tilt: { ...prev.tilt, value: `${tiltVal}%` },
        ndvi: { ...prev.ndvi, value: `${ndviVal}NDVI` },
      }));
    }, 1500);
  };

  const handleLayerToggle = (key: keyof typeof layers) => {
    setLayers(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (!prev[key]) {
        if (key === 'vegetation') {
          setMapCenter([24.7136, 46.6853]);
          setMapZoom(15);
        } else if (key === 'elevation') {
          setMapCenter([24.7186, 46.6800]);
          setMapZoom(16);
        } else if (key === 'soilType') {
          setMapCenter([24.7086, 46.6903]);
          setMapZoom(14);
        } else {
          setMapCenter([24.7136, 46.6753]);
          setMapZoom(14);
        }
      }
      return next;
    });
  };

  // Polygon coordinates [lat, lng] representing Riyadh area
  const polygonPositions: [number, number][] = [
    [24.7236, 46.6853],
    [24.7186, 46.6953],
    [24.7086, 46.6903],
    [24.7000, 46.6800],
    [24.7136, 46.6753],
  ];

  return (
    <div className="flex flex-col h-full w-full font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-2">
        <h1 className="text-[32px] font-bold text-[#1e293b]">تحليل الأرض</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-[#7bc341] hover:bg-[#68a636] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
            {isAnalyzing ? 'جاري التحليل...' : 'تحليل'}
          </button>
          <div className="relative flex-1 md:w-[350px]">
            <input
              type="text"
              placeholder="ابحث بالموقع أو الإحداثيات"
              className="w-full border border-gray-200 rounded-lg pr-4 pl-10 py-2.5 text-sm font-bold placeholder-gray-400 outline-none focus:border-[#7bc341] transition-colors text-right bg-white shadow-sm"
              dir="auto"
            />
            <Search className="w-4 h-4 text-gray-400 stroke-[3] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)] lg:h-[750px] min-h-[600px]">

        {/* Map Container (Center/Left) */}
        <div className="flex-[2] bg-[#f8fafc] rounded-2xl border border-gray-200 relative overflow-hidden shadow-sm flex flex-col order-1 lg:order-2">
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={14}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            <Polygon
              positions={polygonPositions}
              pathOptions={{
                color: layers.landUse ? '#7bc341' : 'transparent',
                fillColor: layers.landUse ? '#86ca86' : 'transparent',
                fillOpacity: layers.landUse ? 0.4 : 0,
                weight: layers.landUse ? 2 : 0
              }}
            />
            {layers.vegetation && (
              <Marker position={[24.7136, 46.6853]} icon={customMarkerIcon}>
                <Popup>مساحة الغطاء النباتي المكتشفة</Popup>
              </Marker>
            )}
            {layers.elevation && (
              <Marker position={[24.7186, 46.6800]} icon={customMarkerIcon}>
                <Popup>أعلى نقطة ارتفاع</Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Header */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col items-end pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-bold text-[13px] bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">تحليل للموقع المختار</span>
              <div className="w-2 h-2 rounded-full bg-[#7bc341] shadow-[0_0_8px_#7bc341]"></div>
            </div>
            <h3 className="text-gray-900 font-bold text-lg mt-1 bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">خريطة التحليل الذكي للموقع</h3>
          </div>
        </div>

        {/* Left Side Panels */}
        <div className="flex-1 w-full lg:w-[320px] flex flex-col gap-6 overflow-y-auto lg:overflow-visible lg:pr-1 pb-8 lg:pb-0 custom-scrollbar order-2 lg:order-1">

          {/* Data Layers Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 font-bold text-[17px] mb-5">طبقات البيانات</h3>

            <div className="flex flex-col gap-3">
              <LayerItem title="استخدام الأراضي" icon={<Map className="w-4.5 h-4.5" />} checked={layers.landUse} onChange={() => handleLayerToggle('landUse')} />
              <LayerItem title="الغطاء النباتي" icon={<Leaf className="w-4.5 h-4.5" />} checked={layers.vegetation} onChange={() => handleLayerToggle('vegetation')} />
              <LayerItem title="الارتفاعات" icon={<Activity className="w-4.5 h-4.5" />} checked={layers.elevation} onChange={() => handleLayerToggle('elevation')} />
              <LayerItem title="نوع التربة" icon={<Layers className="w-4.5 h-4.5" />} checked={layers.soilType} onChange={() => handleLayerToggle('soilType')} />
            </div>
          </div>

          {/* Analysis Insights Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#7bc341] animate-spin mb-2" />
                <span className="text-sm font-bold text-gray-700">جاري معالجة البيانات...</span>
              </div>
            )}
            <h3 className="text-gray-900 font-bold text-[17px] mb-5">رؤى التحليل</h3>

            <div className="flex flex-col gap-3">
              <InsightItem {...insights.suitability as any} />
              <InsightItem {...insights.risks as any} />
              <InsightItem {...insights.constraints as any} />
              <InsightItem {...insights.tilt as any} />
              <InsightItem {...insights.ndvi as any} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function LayerItem({ title, icon, checked, onChange }: { title: string, icon: React.ReactNode, checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#7bc341]/40 cursor-pointer transition-all bg-white shadow-[0_2px_12px_rgba(0,0,0,0.015)] group relative overflow-hidden">
      {checked && <div className="absolute inset-0 bg-[#f4fbf4] opacity-80 z-0" />}

      {/* Checkbox (Left-most) */}
      <div className="z-10 w-5 h-5 rounded-[4px] shrink-0 flex items-center justify-center border border-gray-300 relative ml-1">
        {checked && <div className="absolute inset-0 bg-[#7bc341] rounded-[3px] flex items-center justify-center"><svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
        <input type="checkbox" className="opacity-0 absolute w-full h-full cursor-pointer" checked={checked} onChange={onChange} />
      </div>

      <div className="flex items-center gap-3.5 z-10 mr-auto">
        <span className="text-gray-900 font-bold text-[14px] select-none">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${checked ? 'bg-[#e8f4ed] text-[#7bc341]' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'}`}>
          {icon}
        </div>
      </div>
    </label>
  )
}

function InsightItem({ title, value, subValue, icon, bg, color, type = 'text', dot }: { title: string, value: string, subValue: string, icon: React.ReactNode, bg: string, color: string, type?: 'text' | 'badge', dot: string }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-[12px] border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
      <div className="flex flex-col items-start gap-1">
        {type === 'badge' ? (
          <div className="flex items-center gap-1.5 bg-[#ebf5eb] px-2.5 py-[3px] rounded-full mt-1 border border-[#e1ece1]">
            <span className="text-[#065f46] font-bold text-[11px] pb-[1px]">{value}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${dot} ml-0.5`} />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-[#f8fafc] px-3 py-[3px] rounded-full mt-1 border border-gray-100">
            <span className="text-[#334155] font-black text-[11px] pb-[1px]" dir="ltr">{value}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${dot} ml-0.5`} />
          </div>
        )}
        <span className="text-gray-400 text-[11px] font-bold px-1 text-right w-full">{subValue}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-900 font-bold text-[14px]">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function MonitoringView() {
  return (
    <div className="flex flex-col h-full w-full font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-2">
        <h1 className="text-[32px] font-bold text-[#1e293b]">المراقبة</h1>
        <div className="flex items-center gap-2 w-full md:w-auto flex-row-reverse md:flex-row">
          <div className="relative flex-1 md:w-[350px]">
            <input
              type="text"
              placeholder="ابحث برقم الجهاز أو الموقع"
              className="w-full border border-gray-200 rounded-lg pr-4 pl-10 py-2.5 text-sm font-bold placeholder-gray-400 outline-none focus:border-[#7bc341] transition-colors text-right bg-white shadow-sm"
              dir="auto"
            />
            <Search className="w-4 h-4 text-gray-400 stroke-[3] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="bg-[#7bc341] hover:bg-[#68a636] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors shrink-0">
            بحث
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start gap-3 mb-6">
        <button className="flex items-center gap-2 bg-[#7bc341] hover:bg-[#68a636] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
          <Play className="w-4 h-4 fill-white" />
          تشغيل المحاكاة
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
          <FileText className="w-4 h-4" />
          تصدير للملف
        </button>
      </div>

      <MonitoringKpis />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Right side organically (RTL) but rendered first flex item if direction RTL */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          <PerformanceMatrix />
          <LiveTimeline />
        </div>

        {/* Main large area */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <EnvironmentalChartPanel />
          <SensorsTablePanel />
        </div>
      </div>

      {/* Shared Footer for Monitoring */}
      <footer className="mt-8 flex flex-col items-start gap-4 py-8 border-t border-gray-200 text-sm font-bold text-gray-500">
        <div className="text-right">
          <p className="mb-1 text-gray-900">جميع الحقوق محفوظة لمنصة نامي © 2024</p>
          <p className="mb-1">تم تطويره وصيانته بواسطة منصة نامي</p>
          <p>تاريخ آخر تعديل: 04/12/2020</p>
        </div>
      </footer>
    </div>
  )
}

function MonitoringKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MonKpi title="أجهزة نشطة" val="1,284" sub="1,284" badge="+12" progress={80} icon={<Wifi className="w-5 h-5 text-[#84cc16]" />} color="bg-[#84cc16]" badgeColor="text-[#84cc16]" />
      <MonKpi title="تنبيهات اليوم" val="47" sub="حد 60" badge="+8%" progress={47 / 60 * 100} icon={<ShieldAlert className="w-5 h-5 text-[#1e293b]" />} color="bg-[#1e293b]" badgeColor="text-gray-500" />
      <MonKpi title="معدل الاستجابة" val="1.4 ثانية" sub="" badge="0.2" progress={60} icon={<Zap className="w-5 h-5 text-[#0ea5e9]" />} color="bg-[#0ea5e9]" badgeColor="text-[#0ea5e9]" />
      <MonKpi title="تغطية الشبكة" val="98.6" sub="%" badge="+0.4" progress={98.6} icon={<Activity className="w-5 h-5 text-[#0f766e]" />} color="bg-[#0f766e]" badgeColor="text-[#0f766e]" />
    </div>
  )
}

function MonKpi({ title, val, sub, badge, progress, icon, color, badgeColor }: any) {
  return (
    <div className="bg-white rounded-[14px] border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-[120px]">
      <div className="flex justify-between items-center text-[13px] font-bold text-[#1e293b] mb-2">
        <span className="flex items-center gap-1.5">{icon} {title}</span>
        <span dir="ltr" className={badgeColor}>{badge}</span>
      </div>
      <div className="flex justify-between items-baseline mb-4">
        <div className="flex items-baseline gap-1" dir="rtl">
          <span className="text-[26px] font-black text-gray-900" dir="ltr">{val}</span>
          <span className="text-[12px] font-bold text-gray-400" dir="ltr">{sub}</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden flex flex-row-reverse">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

function PerformanceMatrix() {
  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-5 shadow-sm">
      <h3 className="text-gray-900 font-bold text-[16px] mb-5 text-center">مصفوفة الأداء</h3>
      <div className="flex flex-col gap-4">
        <PerfItem id="أ" title="القطاع أ" status="96% صحي" sub="214/218 متصل · 2 تنبيه" pct={96} color="text-[#7bc341]" bar="bg-[#7bc341]" />
        <PerfItem id="ب" title="القطاع ب" status="96% صحي" sub="214/218 متصل · 2 تنبيه" pct={96} color="text-[#7bc341]" bar="bg-[#7bc341]" />
        <PerfItem id="ج" title="القطاع ج" status="80% صحي" sub="214/218 متصل · 2 تنبيه" pct={80} color="text-orange-500" bar="bg-[#1e293b]" />
      </div>
    </div>
  )
}

function PerfItem({ id, title, status, sub, pct, color, bar }: any) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#1e293b] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {id}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[#1e293b] text-[15px]">{title}</span>
            <span className="text-[10px] font-bold text-gray-400">{sub}</span>
          </div>
        </div>
        <span className={`font-bold text-[11px] mt-1 ${color}`} dir="ltr">{status}</span>
      </div>
      <div className="w-full bg-gray-100 h-[5px] rounded-full overflow-hidden flex flex-row-reverse mt-1">
        <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  )
}

function LiveTimeline() {
  const events = [
    { time: '14:42:08', desc: 'تجاوز حد PM10 — القطاع أ · 142 μg/m³', color: 'border-[#7bc341]' },
    { time: '14:42:08', desc: 'ضوضاء ليلية — القطاع ج · 78 dB لمدة 12د', color: 'border-red-500' },
    { time: '14:42:08', desc: 'انخفاض بطارية WZ-04019 إلى 12%', color: 'border-orange-500' },
    { time: '14:42:08', desc: 'تجاوز حد PM10 — القطاع أ · 142 μg/m³', color: 'border-[#7bc341]' },
  ];
  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-5 shadow-sm relative grow">
      <h3 className="text-gray-900 font-bold text-[16px] mb-6 text-center">الخط الزمني المباشر</h3>
      <div className="relative border-r-[3px] border-gray-100 pr-5 flex flex-col gap-8 mr-2 mt-4">
        {events.map((ev, i) => (
          <div key={i} className="flex flex-col relative w-full items-start">
            {/* Timeline dot */}
            <div className={`absolute -right-[28px] top-1 w-3.5 h-3.5 bg-white border-[3px] rounded-full ${ev.color}`}></div>
            <span className="text-[10px] font-black text-gray-900 mb-1" dir="ltr">{ev.time}</span>
            <span className="text-[11px] font-bold text-gray-500 leading-relaxed text-right w-full">{ev.desc}</span>
          </div>
        ))}
      </div>
      <button className="mt-8 flex items-center gap-1.5 text-[12px] font-bold text-gray-900 hover:text-[#7bc341] transition-colors w-full justify-center">
        أرشفة الأحداث المعالجة
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function EnvironmentalChartPanel() {
  const data = [
    { name: '1', line1: 20, line2: 30 },
    { name: '2', line1: 35, line2: 25 },
    { name: '3', line1: 35, line2: 25 },
    { name: '4', line1: 50, line2: 40 },
    { name: '5', line1: 65, line2: 45 },
    { name: '6', line1: 68, line2: 40 },
    { name: '7', line1: 60, line2: 38 },
    { name: '8', line1: 75, line2: 40 },
    { name: '9', line1: 75, line2: 38 },
    { name: '10', line1: 85, line2: 45 },
  ];

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm mb-6 flex flex-col min-h-[460px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-10 w-full flex-col md:flex-row-reverse gap-4">
        <div className="flex flex-col items-end gap-1 shrink-0 w-full md:w-auto">
          <div className="flex items-center justify-end gap-1.5 w-full">
            <span className="text-[12px] font-bold text-gray-500">تدفق المؤشرات · 24 ساعة</span>
            <div className="w-2 h-2 bg-[#7bc341] rounded-full shadow-[0_0_6px_rgba(123,195,65,0.6)] animate-pulse"></div>
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 mt-0.5 text-right w-full">المراقبة الزمنية للمؤشرات البيئية</h3>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 p-1.5 rounded-xl shrink-0 w-full overflow-x-auto">
          {['الهواء', 'الضوضاء', 'المياه', 'الطاقة'].map(tab => (
            <button key={tab} className={`flex-1 md:flex-none px-4 xl:px-6 py-1.5 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${tab === 'الهواء' ? 'bg-white text-[#7bc341] border border-[#7bc341]/30 shadow-sm' : 'text-gray-500 hover:text-gray-900 border border-transparent'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[250px] w-full mb-8 relative">
        <ResponsiveContainer width="100%" height="100%" dir="ltr" minWidth={0} minHeight={0}>
          <LineChart data={data}>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: 'rtl' }}
              cursor={{ stroke: '#7bc341', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line activeDot={{ r: 6, fill: '#7bc341', stroke: '#fff', strokeWidth: 2 }} type="monotone" dataKey="line1" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#0ea5e9', strokeWidth: 2 }} />
            <Line activeDot={{ r: 6, fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }} type="monotone" dataKey="line2" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#1e293b', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-auto">
        <EnvStat title="ذروة الهواء" val="142" unit="μg/m³" sub="14:42" />
        <EnvStat title="متوسط المياه" val="23" unit="NTU" sub="اليوم" />
        <EnvStat title="الانبعاثات الفعلية" val="1.84" unit="م.و" sub="13:08" />
        <EnvStat title="ذروة الضوضاء" val="78" unit="dB" sub="02:14" />
      </div>
    </div>
  )
}

function EnvStat({ title, val, unit, sub }: any) {
  return (
    <div className="border border-gray-100 rounded-[14px] p-5 flex flex-col justify-center items-center shadow-[0_2px_8px_rgba(0,0,0,0.015)] bg-white hover:border-gray-200 transition-colors">
      <span className="text-[12px] font-bold text-gray-500 mb-2">{title}</span>
      <div className="flex items-baseline gap-1" dir="rtl">
        <span className="text-[20px] font-black text-gray-900" dir="ltr">{val}</span>
        <span className="text-[13px] font-bold text-gray-500" dir="ltr">{unit}</span>
      </div>
      <span className="text-[11px] font-bold text-gray-400 mt-2" dir="ltr">{sub}</span>
    </div>
  )
}

function SensorsTablePanel() {
  const sensors = [
    { id: 'WZ-02145', type: 'محطة جوية', loc: 'القطاع أ، بوابة 3', status: 'متصل', battery: 100, signal: 'good', lastContent: 'قبل 5 د', statusColor: 'text-[#7bc341] bg-[#f4fbf4] border-[#7bc341]/30', statusIcon: <CheckCircle2 className="w-3.5 h-3.5" />, ic: <Wind className="w-4 h-4 text-gray-500" />, icBg: 'bg-white' },
    { id: 'WZ-02145', type: 'حساس مياه', loc: 'القطاع أ، أنبوب', status: 'حرجة', battery: 100, signal: 'good', lastContent: 'قبل 5 د', statusColor: 'text-red-500 bg-red-50 border-red-500/30', statusIcon: <AlertTriangle className="w-3.5 h-3.5" />, ic: <Droplet className="w-4 h-4 text-[#7bc341]" />, icBg: 'bg-white' },
    { id: 'WZ-02145', type: 'حساس ضوضاء', loc: 'القطاع ب، مولد 4', status: 'تحذير', battery: 100, signal: 'good', lastContent: 'قبل 5 د', statusColor: 'text-orange-500 bg-orange-50 border-orange-500/30', statusIcon: <AlertTriangle className="w-3.5 h-3.5" />, ic: <Volume2 className="w-4 h-4 text-[#7bc341]" />, icBg: 'bg-white' },
    { id: 'WZ-02145', type: 'عداد طاقة', loc: 'المولد الرئيسي، 04', status: 'غير متصل', battery: 10, signal: 'good', lastContent: 'قبل 5 د', statusColor: 'text-gray-500 bg-gray-50 border-gray-300', statusIcon: <XCircle className="w-3.5 h-3.5" />, ic: <Zap className="w-4 h-4 text-[#7bc341]" />, icBg: 'bg-white' },
  ];

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm overflow-hidden flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 flex-row-reverse">
        <h3 className="text-gray-900 font-bold text-[17px] w-full text-right md:w-auto">حالة الحساسات في الوقت الفعلي</h3>
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 overflow-x-auto w-full md:w-auto">
          {['الكل', 'متصل', 'تحذير', 'خارج'].map(tab => (
            <button key={tab} className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border whitespace-nowrap ${tab === 'الكل' ? 'bg-white text-[#7bc341] border-[#7bc341]/30 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full min-w-[800px] text-right">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[15%] text-right">الجهاز</th>
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[15%] text-right">النوع</th>
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[20%] text-right">الموقع</th>
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[15%] text-center">الحالة</th>
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[15%] text-center">البطارية</th>
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[10%] text-center">الإشارة</th>
              <th className="font-bold text-gray-900 text-[14px] pb-4 px-2 whitespace-nowrap w-[10%] text-center">آخر اتصال</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sensors.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-[10px] ${s.icBg} flex items-center justify-center border border-gray-200 shadow-sm`}>
                      {s.ic}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-[#1e293b] text-[13px]" dir="ltr">{s.id.split('-')[0]}-</span>
                      <span className="font-bold text-[#1e293b] text-[13px] mt-[-2px] tracking-tight" dir="ltr">{s.id.split('-')[1]}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-gray-700 text-[13px] font-bold text-right">{s.type}</td>
                <td className="py-4 px-2">
                  <span className="text-gray-700 text-[13px] font-bold flex items-center justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {s.loc}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold mx-auto w-fit ${s.statusColor}`}>
                    {s.statusIcon}
                    {s.status}
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-gray-700 text-[12px] min-w-[36px] text-left" dir="ltr">{s.battery}%</span>
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden flex flex-row-reverse border border-gray-200">
                      <div className={`h-full ${s.battery > 20 ? 'bg-[#7bc341]' : 'bg-red-500'}`} style={{ width: `${s.battery}%` }}></div>
                    </div>
                    {s.battery > 20 ? <BatteryFull className="w-4 h-4 text-[#7bc341]" /> : <BatteryLow className="w-4 h-4 text-red-500" />}
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <Wifi className="w-4 h-4 text-[#7bc341] mx-auto" />
                </td>
                <td className="py-4 px-2 text-gray-500 text-[12px] font-bold">
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {s.lastContent}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


function SimulationView({ showToast }: { showToast: (m: string) => void }) {
  return (
    <div className="flex flex-col h-full w-full font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-2">
        <h1 className="text-[32px] font-bold text-[#1e293b]">المحاكاة</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={() => showToast('جاري التحليل...')} className="bg-[#7bc341] hover:bg-[#68a636] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
            تحليل
          </button>
          <div className="relative flex-1 md:w-[350px]">
            <input
              type="text"
              placeholder="ابحث بالموقع أو الإحداثيات"
              className="w-full border border-gray-200 rounded-lg pr-4 pl-10 py-2.5 text-sm font-bold placeholder-gray-400 outline-none focus:border-[#7bc341] transition-colors text-right bg-white shadow-sm"
              dir="auto"
            />
            <Search className="w-4 h-4 text-gray-400 stroke-[3] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button onClick={() => showToast('جاري التصدير...')} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
          <FileText className="w-4 h-4" />
          تصدير للملف
        </button>
        <button onClick={() => showToast('جاري تشغيل عملية المحاكاة...')} className="flex items-center gap-2 bg-[#7bc341] hover:bg-[#68a636] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
          <Play className="w-4 h-4 fill-white" />
          تشغيل المحاكاة
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Scenarios Panel (Right logically in RTL) */}
        <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6">
          <ScenariosPanel />
          <ComparisonPanel />
        </div>

        {/* Main Content (Left logically in RTL) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <ChartPanel />
          <VariablesPanel />
        </div>

      </div>
    </div>
  )
}

function ScenariosPanel() {
  const [activeId, setActiveId] = useState('ب');

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 font-bold text-[17px] mb-5">السيناريوهات</h3>
      <div className="flex flex-col gap-3">
        <ScenarioCard
          id="أ" title="الخط الأساسي" desc="الوضع الحالي دون أي تدخلات بيئية"
          stats={{ co2: 1100, water: 84, energy: 920 }} score={54}
          active={activeId === 'أ'} onClick={() => setActiveId('أ')}
        />
        <ScenarioCard
          id="ب" title="طاقة شمسية + مياه رمادية" desc="دمج ألواح كهروضوئية وإعادة تدوير المياه"
          stats={{ co2: 740, water: 52, energy: 660 }} score={86}
          active={activeId === 'ب'} onClick={() => setActiveId('ب')} aiRecommended={true}
        />
        <ScenarioCard
          id="ج" title="بناء معياري منخفض الانبعاث" desc="مواد منخفضة الكربون وتجميع جاف"
          stats={{ co2: 820, water: 66, energy: 920 }} score={78}
          active={activeId === 'ج'} onClick={() => setActiveId('ج')}
        />
      </div>
    </div>
  )
}

function ScenarioCard({ id, title, desc, stats, score, active, aiRecommended, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-4 rounded-[14px] border transition-all cursor-pointer relative overflow-hidden ${active ? 'border-[#7bc341] bg-[#f4fbf4] shadow-[0_2px_12px_rgba(123,195,65,0.08)]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      {aiRecommended && (
        <div className="absolute top-0 right-1/2 translate-x-1/2 bg-[#7bc341] text-white text-[10px] font-bold px-2.5 py-[3px] rounded-b-[6px] flex items-center gap-1 z-10 shadow-sm">
          <Check className="w-3 h-3" strokeWidth={3} /> اختيار الذكاء
        </div>
      )}
      <div className="flex justify-between items-start mb-2 relative z-0 mt-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm shadow-sm ${active ? 'bg-[#7bc341] text-white' : 'bg-[#1e293b] text-white'}`}>
            {id}
          </div>
          <h4 className="font-bold text-[#1e293b] text-[15px]">{title}</h4>
        </div>
        <span className={`font-black text-[18px] ${active ? 'text-[#7bc341]' : 'text-gray-400'}`}>{score}</span>
      </div>
      <p className="text-gray-500 text-[12px] font-medium mb-4 pr-[38px] leading-relaxed select-none">{desc}</p>
      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 pt-3 border-t border-gray-100/80">
        <span className="flex items-center gap-1"><ArrowDownRight className="w-3.5 h-3.5 text-[#7bc341]" /> <span dir="ltr">{stats.co2} ط</span></span>
        <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-[#7bc341]" /> <span dir="ltr">{stats.water} م.ل</span></span>
        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[#7bc341]" /> <span dir="ltr">{stats.energy} م.و</span></span>
      </div>
    </div>
  )
}

function ComparisonPanel() {
  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 font-bold text-[17px] mb-6">مقارنة بالأساسي</h3>

      <div className="flex flex-col gap-4 mb-6">
        <ComparisonBar label="الكربون" val="1100 ط" pct={80} />
        <ComparisonBar label="المياه" val="84 م.لتر" pct={60} />
        <ComparisonBar label="الطاقة" val="920 م.و.س" pct={90} />
      </div>

      <div className="bg-[#f4fbf4] border border-[#7bc341]/30 rounded-[14px] p-4 relative overflow-hidden">
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#7bc341]/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-1.5 mb-2 relative z-10">
          <div className="bg-white border border-[#7bc341]/50 text-[#7bc341] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit shadow-sm">
            <Check className="w-3 h-3" /> توصية
          </div>
        </div>
        <p className="text-[#1e293b] text-[13px] font-bold leading-relaxed mb-4 mt-3 relative z-10">
          تبني السيناريو «ب» يحقق انخفاضًا تراكميًا قدره <span className="text-[#7bc341] font-black mx-0.5" dir="ltr">33%</span> في الكربون خلال 7 سنوات بتكلفة استرداد <span className="font-black mx-0.5">4.2</span> سنة فقط.
        </p>
        <button className="relative z-10 w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
          اعتماد الخطة
          <ArrowUpLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ComparisonBar({ label, val, pct }: any) {
  return (
    <div className="flex items-center gap-3 text-[12px] font-bold">
      <span className="text-gray-600 w-[50px] text-right shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex flex-row-reverse">
        <div className="h-full bg-[#1e293b] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
      </div>
      <span className="text-gray-900 w-[70px] text-left shrink-0" dir="ltr">{val}</span>
    </div>
  )
}

function ChartPanel() {
  const data = [
    { name: '1', value: 30 }, { name: '2', value: 35 }, { name: '3', value: 32 }, { name: '4', value: 40 },
    { name: '5', value: 45 }, { name: '6', value: 55 }, { name: '7', value: 52 }, { name: '8', value: 60 },
    { name: '9', value: 65 }, { name: '10', value: 60 }, { name: '11', value: 62 }, { name: '12', value: 50 },
    { name: '13', value: 48 }, { name: '14', value: 52 }, { name: '15', value: 58 }, { name: '16', value: 62 },
    { name: '17', value: 65 }, { name: '18', value: 68 }, { name: '19', value: 67 }, { name: '20', value: 72 },
    { name: '21', value: 70 }, { name: '22', value: 75 }, { name: '23', value: 80 }, { name: '24', value: 78 },
    { name: '25', value: 82 }, { name: '26', value: 85 }, { name: '27', value: 88 }, { name: '28', value: 92 },
    { name: '29', value: 90 }, { name: '30', value: 95 }
  ];

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-1 flex flex-col shadow-sm">
      {/* Chart Area */}
      <div className="relative h-[250px] md:h-[280px] bg-[#f8fafc] rounded-t-[18px] overflow-hidden pt-6">
        <div className="absolute top-6 right-8 flex items-center justify-between w-full z-10 pointer-events-none">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#7bc341] rounded-full shadow-[0_0_6px_rgba(123,195,65,0.6)] animate-pulse"></div>
              <span className="text-[13px] font-bold text-gray-500">الإسقاط الزمني · 30 سنة</span>
            </div>
            <h3 className="text-[17px] font-bold text-gray-900 mt-0.5">بناء معياري منخفض الانبعاثات</h3>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%" className="-mb-2 relative z-0" minWidth={0} minHeight={0}>
          <AreaChart data={data} margin={{ top: 60, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValueSim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7bc341" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7bc341" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: 'rtl' }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: '#7bc341', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }}
            />
            <Area activeDot={{ r: 6, fill: '#7bc341', stroke: '#fff', strokeWidth: 2 }} type="monotone" dataKey="value" stroke="#7bc341" strokeWidth={4} fillOpacity={1} fill="url(#colorValueSim)" />
          </AreaChart>
        </ResponsiveContainer>

        {/* Target Value highlight ring overlay */}
        <div className="absolute left-[30%] top-[35%] w-12 h-12 border-[3px] border-[#7bc341]/80 rounded-full bg-white/20 backdrop-blur-sm z-10 shadow-[0_4px_16px_rgba(123,195,65,0.3)] pointer-events-none">
          <div className="absolute inset-2.5 bg-[#7bc341]/30 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-3.5 bg-[#7bc341] rounded-full"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100 p-2 border-t border-gray-100">
        <StatBox title="نقاط الاستدامة" val="86/100" />
        <StatBox title="انبعاثات الكربون" val="86/740 ط" />
        <StatBox title="استهلاك المياه" val="52 م.ل" />
        <StatBox title="استهلاك الطاقة" val="680 م.و" />
      </div>
    </div>
  )
}

function StatBox({ title, val }: any) {
  return (
    <div className="flex-1 py-4 flex flex-col items-center justify-center hover:bg-gray-50/50 transition-colors first:rounded-r-[16px] last:rounded-l-[16px]">
      <span className="text-[17px] font-black text-[#1e293b] mb-1" dir="ltr">{val}</span>
      <span className="text-[12px] font-bold text-gray-500">{title}</span>
    </div>
  )
}

function VariablesPanel() {
  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-6 md:p-8 shadow-sm">
      <h3 className="text-gray-900 font-bold text-[17px] mb-8">متغيرات المحاكاة</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <VariableSlider title="كثافة الطاقة الشمسية" defaultVal={65} icon={<Sun className="w-5 h-5 text-[#7bc341]" />} color="bg-[#7bc341]" bg="bg-[#f4fbf4]" min={0} max={100} />
        <VariableSlider title="إعادة تدوير المياه" defaultVal={65} icon={<Droplet className="w-5 h-5 text-[#f97316]" />} color="bg-[#f97316]" bg="bg-[#fff7ed]" min={0} max={100} />
        <VariableSlider title="الغطاء النباتي" defaultVal={42} icon={<Leaf className="w-5 h-5 text-[#7bc341]" />} color="bg-[#7bc341]" bg="bg-[#f4fbf4]" min={0} max={100} />
        <VariableSlider title="الكثافة الصناعية" defaultVal={65} icon={<Factory className="w-5 h-5 text-[#7bc341]" />} color="bg-[#7bc341]" bg="bg-[#f4fbf4]" min={0} max={100} />
        <VariableSlider title="تهوية طبيعية" defaultVal={65} icon={<Wind className="w-5 h-5 text-[#7bc341]" />} color="bg-[#7bc341]" bg="bg-[#f4fbf4]" min={0} max={100} />
      </div>
    </div>
  )
}

function VariableSlider({ title, defaultVal, icon, color, bg, min, max }: any) {
  const [val, setVal] = useState(defaultVal);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1 || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // percentage calculation based on direction RTL
    let pct = (1 - (x / rect.width)) * 100;
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    // map to min..max if they exist
    setVal(pct);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    handlePointerMove(e);
    // Add event listeners for mouseup to handle capturing
    const handleUp = () => {
      document.removeEventListener('pointerup', handleUp);
    };
    document.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="flex flex-col border border-gray-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] bg-white h-[120px] justify-between hover:border-gray-200 transition-colors group">
      <div className="flex items-center justify-between w-full">
        <span className="text-[14px] font-bold text-gray-900">{title}</span>
        <div className={`p-2.5 rounded-xl ${bg} transition-colors`}>
          {icon}
        </div>
      </div>

      <div className="w-full flex items-center gap-4 mt-2 mb-1">
        <span className="text-[13px] font-black text-gray-600 w-9 text-right shrink-0" dir="ltr">{val}%</span>
        <div
          className="flex-1 h-3 bg-gray-100 rounded-full relative flex items-center cursor-pointer overflow-visible touch-none"
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <div className={`h-full ${color} rounded-full absolute right-0 pointer-events-none transition-all duration-75 ease-out`} style={{ width: `${val}%` }}></div>
          {/* Slider handle */}
          <div className={`w-6 h-6 rounded-full ${color} absolute shadow-sm border-[4px] border-white touch-none group-hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing z-10 flex items-center justify-center`} style={{ right: `calc(${val}% - 12px)` }}>
            {/* Optional inner dot */}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardView({ showToast }: { showToast: (m: string) => void }) {
  return (
    <>
      <DashboardHeader showToast={showToast} />

      <div className="flex flex-col gap-6 mt-8">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard title="الحرارة" value="31.4°" unit="م" icon={<Thermometer />} pillText="0.3 ↑" />
          <KpiCard title="الرياح" value="12" unit="كم/س" icon={<Wind />} pillText="ش.غ" pillIcon={<MapPin className="w-3 h-3" />} />
          <KpiCard title="الرطوبة" value="48" unit="%" icon={<Droplets />} pillText="-2 ↓" />
          <KpiCard title="القدرة الاستيعابية البيئية" value="1.84" unit="م.و" icon={<Zap />} pillText="-6% ↓" />
          <KpiCard title="متوسط الضوضاء" value="62" unit="ديسيبل" icon={<Volume2 />} pillText="+4 ↑" />
          <KpiCard title="الغطاء النباتي" value="0.62" unit="NDVI" icon={<Leaf />} pillText="ثابت" pillIcon={<RotateCw className="w-3 h-3" />} />
        </div>

        {/* Row 2: Maps and complex cards */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-3">
            <HealthIndexCard />
          </div>
          <div className="col-span-12 xl:col-span-6">
            <MapCard />
          </div>
          <div className="col-span-12 xl:col-span-3">
            <LiveAlertsCard />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-4">
            <AirQualityCard />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <AiRecommendationCard />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <CarbonFootprintCard />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 flex">
            <WhatIfCard showToast={showToast} />
          </div>
          <div className="col-span-12 xl:col-span-4 flex">
            <ComplianceCard showToast={showToast} />
          </div>
        </div>

        {/* Row 5 */}
        <div className="mt-4">
          <AssistantCard />
        </div>

        {/* Footer */}
        <footer className="mt-8 flex flex-col items-start gap-4 py-8 border-t border-gray-200 text-sm font-bold text-gray-500">
          <div className="text-right">
            <p className="mb-1 text-gray-900">جميع الحقوق محفوظة لمنصة نامي © 2024</p>
            <p className="mb-1">تم تطويره وصيانته بواسطة منصة نامي</p>
            <p>تاريخ آخر تعديل: 04/12/2020</p>
          </div>
          <LogoIcon className="w-10 h-10 text-[#5EA15E] opacity-60 grayscale mt-2" />
        </footer>
      </div>
    </>
  );
}

function ReportsView({ showToast }: { showToast: (m: string) => void }) {
  return (
    <div className="flex flex-col h-full w-full font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 mt-2">
        <h1 className="text-[32px] font-bold text-[#1e293b]">التقارير</h1>
        <div className="flex items-center gap-2 w-full md:w-auto flex-row-reverse md:flex-row">
          <button onClick={() => showToast('جاري بدء تقرير جديد...')} className="bg-[#7bc341] hover:bg-[#68a636] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors shrink-0">
            تقرير جديد +
          </button>
        </div>
      </div>
      <p className="text-gray-500 font-bold mb-8">إدارة وتنزيل التقارير البيئية وتقارير الامتثال.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <FileText className="w-10 h-10 text-[#7bc341] mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">التقرير الشهري {i} - 2024</h3>
            <p className="text-sm font-bold text-gray-500 mb-4">تم الإنشاء في: 01/0{i}/2024</p>
            <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-4">
              <span className="text-[12px] font-bold bg-[#f4faf4] text-[#5EA15E] px-3 py-1 rounded-full">مكتمل</span>
              <button onClick={() => showToast(`تم تنزيل التقرير الشهري ${i}`)} className="text-[#0ea5e9] hover:underline text-sm font-bold">تنزيل PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpView({ showToast }: { showToast: (m: string) => void }) {
  return (
    <div className="flex flex-col h-full w-full font-sans max-w-4xl mx-auto">
      <h1 className="text-[32px] font-bold text-[#1e293b] mb-4 mt-2">مركز المساعدة</h1>
      <p className="text-gray-500 mb-8 font-bold text-[15px]">نحن هنا لمساعدتك والإجابة على جميع استفساراتك المتعلقة بالمنصة.</p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900 text-[17px]">الأسئلة الشائعة</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {['كيف يمكنني تصدير تقرير التقييم البيئي؟', 'ما هي مصادر البيانات المستخدمة في المنصة؟', 'هل يمكن ربط المنصة بأنظمة استشعار خارجية؟', 'كيف تعمل الإشعارات والتنبيهات المباشرة؟'].map((q, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition cursor-pointer flex items-center justify-between group">
              <h4 className="font-bold text-gray-800 text-[15px] group-hover:text-[#7bc341] transition-colors">{q}</h4>
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#7bc341] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-12">
        <h3 className="font-bold text-gray-900 text-[17px] mb-6">تواصل مع الدعم الفني</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast('تم إرسال رسالتك بنجاح. سيتم التواصل معك قريباً!');
          }}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" required placeholder="الاسم" className="border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold outline-none focus:border-[#7bc341] bg-gray-50/50 focus:bg-white transition-colors" />
            <input type="email" required placeholder="البريد الإلكتروني" className="border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold outline-none focus:border-[#7bc341] bg-gray-50/50 focus:bg-white transition-colors" />
          </div>
          <textarea required placeholder="كيف يمكننا مساعدتك؟" rows={4} className="border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-bold outline-none focus:border-[#7bc341] bg-gray-50/50 focus:bg-white transition-colors"></textarea>
          <button type="submit" className="bg-[#1e293b] hover:bg-[#334155] text-white px-8 py-3.5 rounded-xl text-[14px] font-bold shadow-sm transition-transform active:scale-95 w-fit mt-2">
            إرسال الرسالة
          </button>
        </form>
      </div>
    </div>
  );
}

function AuthNavbar() {
  return (
    <nav className="h-[72px] bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50" dir="rtl">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
        <LogoIcon className="w-10 h-10 object-contain" />
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-[14px] font-bold text-gray-700">
        <a href="#" className="text-[#5EA15E] hover:opacity-80 transition-opacity">الرئيسية</a>
        <a href="#" className="hover:text-[#5EA15E] transition-colors">عن المنصة</a>
        <a href="#" className="hover:text-[#5EA15E] transition-colors flex items-center gap-1">خدماتنا <ChevronDown className="w-3.5 h-3.5" /></a>
        <a href="#" className="hover:text-[#5EA15E] transition-colors">الأسئلة الشائعة</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm font-bold text-gray-600 hover:text-[#5EA15E] flex items-center gap-1 transition-colors">
          EN
          <LanguageIcon />
        </button>
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <div className="w-7 h-7 rounded-full bg-[#5EA15E] flex items-center justify-center text-white text-xs font-black shadow-sm">AB</div>
          <span className="hidden sm:inline">صلاح عبدالله</span>
        </div>
      </div>
    </nav>
  );
}

function AuthFooter() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-gray-100 py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <LogoIcon className="w-8 h-8 text-[#5EA15E]" />
      </div>
      <div className="text-center text-[12px] font-bold text-gray-500 flex flex-col gap-1">
        <p>جميع الحقوق محفوظة لمنصة نامي © 2024</p>
        <p>تم تطويره وصيانته بواسطة منصة نامي</p>
        <p>تاريخ آخر تعديل: 04/12/2020</p>
      </div>
    </footer>
  );
}

function LoginView({ onLogin, onNavigateRegister }: { onLogin: () => void, onNavigateRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.trim()) { setError('يرجى إدخال البريد الإلكتروني'); return; }
    if (!password.trim()) { setError('يرجى إدخال كلمة المرور'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('البريد الإلكتروني غير صحيح'); return; }
    setError('');
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      <AuthNavbar />
      <div className="flex flex-1">
        {/* Left: Form */}
        <div className="flex-1 flex items-center justify-center px-12 py-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-[440px] flex flex-col items-center">
            <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
              <LogoIcon className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-[28px] font-black text-[#1e293b] mb-2 text-center">تسجيل الدخول</h1>
            <p className="text-gray-500 font-medium text-sm text-center mb-10">سجل الدخول للوصول إلى لوحة التحكم البيئية الخاصة بك</p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">البريد الإلكتروني <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="name@company.com" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#7bc341] transition-all text-[14px] font-medium bg-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">كلمة المرور <span className="text-red-500">*</span></label>
                <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#7bc341] transition-all text-[14px] font-medium bg-white" />
                <a href="#" className="text-xs font-bold text-[#7bc341] hover:underline text-right mt-0.5">نسيت كلمة المرور؟</a>
              </div>
              {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 px-3 rounded-lg">{error}</p>}
              <button onClick={handleLogin} className="w-full bg-[#5EA15E] hover:bg-[#4d8f4d] text-white font-bold py-3.5 rounded-lg transition-all shadow-sm text-[15px] mt-2">
                تسجيل الدخول
              </button>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs font-bold text-gray-400">أو</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <button onClick={onNavigateRegister} className="w-full border border-gray-200 text-gray-700 font-bold py-3.5 rounded-lg hover:bg-gray-50 transition-all text-[15px]">
                إنشاء حساب جديد
              </button>
              <button onClick={onLogin} className="w-full border-transparent text-[#7bc341] font-bold py-2 hover:underline transition-all text-[14px] mt-2 text-center">
                متابعة كزائر
              </button>
            </div>
          </motion.div>
        </div>
        {/* Right: Green marketing panel */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-bl from-[#d4eece] via-[#eaf8e4] to-[#f5fdf3] items-center justify-center p-12">
          <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[#7bc341]/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-40px] left-[-40px] w-[300px] h-[300px] bg-[#5EA15E]/15 rounded-full blur-[60px]"></div>
          <div className="relative z-10 text-right w-full max-w-[480px]" dir="rtl">
            <div className="w-24 h-24 bg-[#7bc341]/30 rounded-full mb-10 mr-auto ml-16 flex items-center justify-center">
              <div className="w-14 h-14 bg-[#7bc341]/50 rounded-full"></div>
            </div>
            <h2 className="text-[36px] font-black text-[#1e293b] leading-tight mb-5">ذكاء بيئي لحظي<br />لمشاريع المستقبل</h2>
            <p className="text-[16px] font-medium text-gray-600 leading-relaxed mb-10">راقب , حلل وحاكِ الأثرلبيئي لمشاريعك عبر دورة حياة<br />كاملة من التخطيط حتى التشغيل</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 p-5 flex flex-col items-center gap-2 shadow-sm">
                <Wind className="w-6 h-6 text-[#7bc341]" />
                <span className="text-2xl font-black text-[#1e293b]">18</span>
                <span className="text-xs font-bold text-gray-500">الرياح كم/س</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 p-5 flex flex-col items-center gap-2 shadow-sm">
                <Activity className="w-6 h-6 text-[#7bc341]" />
                <span className="text-2xl font-black text-[#1e293b]">42</span>
                <span className="text-xs font-bold text-gray-500">جودة الهواء</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 p-5 flex flex-col items-center gap-2 shadow-sm">
                <Volume2 className="w-6 h-6 text-[#7bc341]" />
                <span className="text-2xl font-black text-[#1e293b]">55</span>
                <span className="text-xs font-bold text-gray-500">الضوضاء dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}

function RegisterView({ onRegister, onNavigateLogin }: { onRegister: () => void, onNavigateLogin: () => void }) {
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState<string[]>([]);
  const [orgName, setOrgName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [stepError, setStepError] = useState('');
  const totalSteps = 5;
  const stepLabels = ['بيانات الجهة', 'تفاصيل المشروع', 'الموقع والنطاق', 'الأهداف البيئية', 'المراجعة'];

  const toggleGoal = (g: string) => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans" dir="rtl">
      <AuthNavbar />
      <div className="flex-1 px-6 md:px-12 py-10 max-w-[1300px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col items-end mb-8">
          <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
            <LogoIcon className="w-12 h-12 object-contain" />
          </div>
          <div className="text-right">
            <p className="text-[#5EA15E] text-sm font-bold mb-1">— تسجيل مشروع جديد</p>
            <h1 className="text-[32px] font-black text-[#1e293b] mb-2">لنبدأ بفهم مشروعك</h1>
            <p className="text-gray-500 font-medium text-[14px]">هذه البيانات تساعد محرك وازن على بناء نموذج بيئي مخصص لمشروعك وتقديم توصيات دقيقة في الوقت الفعلي.</p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="relative flex items-center justify-between mb-12 px-2">
          <div className="absolute top-4 right-0 left-0 h-[2px] bg-gray-200 z-0">
            <div className="h-full bg-[#5EA15E] transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
          </div>
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={n} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${done ? 'bg-[#5EA15E] border-[#5EA15E] text-white' : active ? 'bg-white border-[#5EA15E] text-[#5EA15E]' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {done ? <Check className="w-4 h-4" /> : n}
                </div>
                <span className={`text-[12px] font-bold whitespace-nowrap ${active ? 'text-[#5EA15E]' : done ? 'text-[#5EA15E]' : 'text-gray-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Main layout: sidebar + content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col gap-5 w-[280px] shrink-0">
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-[#5EA15E]" />
                <span className="font-black text-[#1e293b] text-[14px]">لماذا نسأل ؟</span>
              </div>
              <p className="text-[12px] font-medium text-gray-600 leading-relaxed">كل حقل يربط مشروعك بمصدر بيانات بيئي أو طبقة تنظيمية. كلما زادت الدقة، كانت التوصيات أكثر فاعلية.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#5EA15E]" />
                <span className="font-black text-[#1e293b] text-[14px]">ستحصل على</span>
              </div>
              <div className="flex flex-col gap-2">
                {['لوحة تحكم بيئية مخصصة', 'ربط تلقائي بأجهزة الاستشعار', 'تقارير امتثال جاهزة', 'محاكاة سيناريوهات بالذكاء الاصطناعي'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#5EA15E] shrink-0" />
                    <span className="text-[12px] font-medium text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="w-4 h-4 text-[#5EA15E]" />
                <span className="font-black text-[#1e293b] text-[14px]">تحتاج مساعدة؟</span>
              </div>
              <p className="text-[12px] font-medium text-gray-600 mb-3">فريق الدعم متاح 24/7 لمساعدتك في إعداد المشروع.</p>
              <button className="w-full border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-[13px] hover:bg-gray-50 transition">تحدث مع تخصص</button>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white">
                <h2 className="text-[22px] font-black text-[#1e293b] mb-1 text-right">بيانات الجهة</h2>
                <p className="text-gray-500 text-sm font-medium mb-8 text-right">عرفنا على الجهة المالكة للمشروع</p>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">اسم المنظمة <span className="text-red-500">*</span></label>
                    <input type="text" value={orgName} onChange={e => { setOrgName(e.target.value); setStepError(''); }} placeholder="مثال تطوير شركة نيوم" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] text-right" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">السجل التجاري / الرقم الوحد <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="70xxxxxxxx" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] text-right" dir="ltr" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">القطاع <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] appearance-none bg-white text-right">
                        <option>يرجى اختيار القطاع</option>
                        <option>التطوير العقاري</option>
                        <option>الطاقة والمياه</option>
                        <option>الصناعة</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">الحجم <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="عدد الموظفين" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] text-right" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">البريد المؤسسي <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="contact@ org.example.com" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px]" dir="ltr" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">رقم التواصل <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="••••••••" className="flex-1 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px]" dir="ltr" />
                      <div className="border border-gray-200 rounded-lg px-3 py-3 text-sm font-bold text-gray-600 bg-gray-50">+966</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white">
                <h2 className="text-[22px] font-black text-[#1e293b] mb-1 text-right">تفاصيل المشروع</h2>
                <p className="text-gray-500 text-sm font-medium mb-8 text-right">معلومات أساسية تحدد طبيعة المشروع.</p>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">اسم المشروع <span className="text-red-500">*</span></label>
                    <input type="text" value={projectName} onChange={e => { setProjectName(e.target.value); setStepError(''); }} placeholder="مثال تطوير شركة نيوم" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] text-right" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">وصف مختصر</label>
                    <textarea rows={3} placeholder="وصف مختصر" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] resize-none text-right"></textarea>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">القطاع الرئيسي <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'تطوير حضوري', icon: <Home className="w-6 h-6" /> },
                        { label: 'طاقة متجددة', icon: <Zap className="w-6 h-6" /> },
                        { label: 'صناعي', icon: <Factory className="w-6 h-6" /> },
                        { label: 'سياحي', icon: <Map className="w-6 h-6" /> },
                        { label: 'زراعي', icon: <Leaf className="w-6 h-6" /> },
                        { label: 'موارد مائية', icon: <Droplets className="w-6 h-6" /> },
                      ].map(s => (
                        <div 
                          key={s.label} 
                          onClick={() => { setSelectedSector(s.label); setStepError(''); }}
                          className={`border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition text-center ${selectedSector === s.label ? 'border-[#5EA15E] bg-[#f4fbf4] shadow-sm' : 'border-gray-200 hover:border-[#5EA15E] hover:bg-gray-50'}`}
                        >
                          <span className={selectedSector === s.label ? 'text-[#5EA15E]' : 'text-gray-400'}>{s.icon}</span>
                          <span className={`text-[13px] font-bold ${selectedSector === s.label ? 'text-[#5EA15E]' : 'text-gray-700'}`}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white">
                <h2 className="text-[22px] font-black text-[#1e293b] mb-1 text-right">الموقع والنطاق</h2>
                <p className="text-gray-500 text-sm font-medium mb-8 text-right">حدّد جغرافيا للمشروع لربطه بالطبقات البيئية.</p>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">الدولة</label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] appearance-none bg-white text-right">
                        <option>يرجى اختيار الدولة</option>
                        <option>المملكة العربية السعودية</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">المنطقة / المدينة</label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] appearance-none bg-white text-right">
                        <option>يرجى اختيار المدينة</option>
                        <option>الرياض</option>
                        <option>جدة</option>
                        <option>تبوك</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">إحداثيات المركز (Lat) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="27.556" defaultValue="27.556" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px]" dir="ltr" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">إحداثيات المركز (Lng) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="25.556" defaultValue="25.556" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px]" dir="ltr" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">المساحة الإجمالية (كم²) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="25.00" defaultValue="25.00" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px]" dir="ltr" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700 text-right">نوع التضاريس <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="ساحلي / جبلي / صحراوي" className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#5EA15E] text-[13px] text-right" />
                  </div>
                </div>
                <div className="mt-5 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 bg-gray-50/50">
                  <RotateCw className="w-8 h-8 text-gray-400" />
                  <p className="font-bold text-gray-600 text-[14px]">اسحب و أفلت الملفات هنا للرفع</p>
                  <p className="text-gray-400 text-[12px]">اسحب ملف KML/GeoJSON أو ارسم حدود المشروع على الخريطة</p>
                  <button className="border border-gray-300 text-gray-600 font-bold px-5 py-2 rounded-lg text-[13px] hover:bg-white transition">تصفح الملفات</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white">
                <h2 className="text-[22px] font-black text-[#1e293b] mb-1 text-right">الأهداف البيئية</h2>
                <p className="text-gray-500 text-sm font-medium mb-8 text-right">اختر الأهداف لتفعيل مؤشرات الأداء المناسبة.</p>
                <div className="grid grid-cols-2 gap-4">
                  {['خفض استهلاك المياه', '100% طاقة متجددة', 'تقليل الكربون', 'امتثال كامل للوائح', 'حماية التنوع الحيوي', 'إدارة النفايات الصفرية'].map(goal => (
                    <label key={goal} onClick={() => toggleGoal(goal)} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${goals.includes(goal) ? 'border-[#5EA15E] bg-[#f4fbf4]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="text-[14px] font-bold text-gray-700">{goal}</span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${goals.includes(goal) ? 'bg-[#5EA15E] border-[#5EA15E]' : 'border-gray-300'}`}>
                        {goals.includes(goal) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white">
                <h2 className="text-[22px] font-black text-[#1e293b] mb-1 text-right">المراجعة</h2>
                <p className="text-gray-500 text-sm font-medium mb-8 text-right">تأكد من صحة البيانات قبل تفعيل لوحة التحكم.</p>
                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { label: 'المنظمة', value: orgName || 'لم يتم التحديد' },
                    { label: 'المشروع', value: projectName || 'لم يتم التحديد' },
                    { label: 'القطاع', value: selectedSector || 'لم يتم التحديد' },
                    { label: 'الموقع', value: 'تبوك، السعودية · 27.51, 35.07' },
                    { label: 'المساحة', value: '1,250 كم²' },
                    { label: 'الأهداف', value: `${goals.length > 0 ? goals.length : 2} أهداف بيئية` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center border border-gray-100 rounded-xl px-5 py-4 bg-white">
                      <span className="font-black text-[#1e293b] text-[14px]">{row.value}</span>
                      <span className="text-gray-400 font-bold text-[13px]">{row.label}</span>
                    </div>
                  ))}
                  <div className="border border-[#5EA15E]/30 rounded-xl px-5 py-4 bg-[#f4fbf4] flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#5EA15E]" />
                      <span className="font-black text-[#1e293b] text-[14px]">جاهز للإطلاق</span>
                    </div>
                    <p className="text-gray-500 text-[13px] font-medium">سيقوم محرك وازن بربط مشروعك بـ 1,284 جهاز استشعار وتفعيل 7 وحدات تحليل خلال دقائق.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Nav buttons */}
            {stepError && <p className="text-red-500 text-sm font-bold text-center mt-6 bg-red-50 py-2 rounded-lg">{stepError}</p>}
            <div className="flex gap-4 mt-6">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-lg hover:bg-gray-50 transition text-[14px]">
                  السابق
                </button>
              )}
              <div className="flex-1"></div>
              <button
                onClick={() => { 
                  if (step === 1 && !orgName.trim()) {
                    setStepError('يرجى تعبئة الحقول المطلوبة (اسم المنظمة)');
                    return;
                  }
                  if (step === 2 && (!projectName.trim() || !selectedSector)) {
                    setStepError('يرجى تعبئة اسم المشروع واختيار القطاع الرئيسي');
                    return;
                  }
                  setStepError('');
                  if (step < totalSteps) setStep(s => s + 1); else onRegister(); 
                }}
                className="flex-1 bg-[#5EA15E] hover:bg-[#4d8f4d] text-white font-bold py-3.5 rounded-lg transition text-[14px] shadow-sm"
              >
                {step === totalSteps ? 'ابدأ الآن' : 'التالي'}
              </button>
            </div>
            <div className="mt-6 text-center">
              <button onClick={onNavigateLogin} className="text-sm font-bold text-gray-400 hover:text-[#5EA15E] transition">
                لديك حساب بالفعل؟ سجل دخولك
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}



