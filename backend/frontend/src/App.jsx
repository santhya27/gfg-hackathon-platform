import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// --- FIXED & COMPLETE IMPORTS (No Missing Icons!) ---
import { 
  Moon, Sun, Menu, X, BookOpen, Trophy, Calendar, 
  Users, Home, Mail, LayoutDashboard, MapPin, 
  ExternalLink, Code, ChevronRight, Award,
  LogIn, LogOut, MessageSquare, LifeBuoy, CheckCircle,
  Play, CheckSquare, Square, TrendingUp, Terminal, Star, Briefcase,
  ArrowLeft, Phone, ChevronDown, Medal,
  Search, Bell, Flame, Github, MessageCircle, Bot, Send, BellRing, ArrowRight, Clock,
  Layers, Database, Cpu 
} from 'lucide-react';

import { QRCodeSVG } from 'qrcode.react'; 
import QRCode from 'qrcode';             
import jsPDF from 'jspdf';
import Editor from '@monaco-editor/react';

import StudentPortal from './StudentPortal';
import AdminDashboard from './AdminDashboard';

// --- OFFICIAL LINKS ---
const WHATSAPP_LINK = "https://chat.whatsapp.com/HZjaf6LCpEPCvgiJkdQxi8";

const NavigationButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="fixed bottom-8 left-8 z-40 flex items-center gap-2 px-4 py-3 bg-[#2f8d46] text-white rounded-full font-bold shadow-xl shadow-green-500/30 hover:bg-green-700 transition-all hover:-translate-x-1"
      title="Go Back"
    >
      <ArrowLeft size={20} /> <span className="hidden md:inline">Go Back</span>
    </button>
  );
};

// --- REMINDER MODAL COMPONENT ---
const ReminderModal = ({ darkMode, user, eventTitle, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reminder set successfully! 🚀 Check your inbox soon.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`max-w-md w-full p-6 rounded-3xl shadow-2xl animate-scale-in ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#2f8d46] shrink-0">
              <BellRing size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black">Set Reminder</h3>
              <p className="text-sm text-gray-500">Get an email reminder for this event</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors outline-none">
            <X size={20} />
          </button>
        </div>

        <div className={`p-4 rounded-2xl border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className="font-bold text-lg mb-2">{eventTitle}</h4>
          <div className={`space-y-1.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="flex items-center gap-2"><Calendar size={16}/> 25 March 2026</p>
            <p className="flex items-center gap-2"><Clock size={16}/> 10:00 AM</p>
            <p className="flex items-center gap-2"><MapPin size={16}/> Green Building, 4th Floor — Wozniak Auditorium</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold mb-2">Your Email Address</label>
          <input 
            required 
            type="email" 
            defaultValue={user ? user.email : ''} 
            placeholder="student@example.com" 
            className={`w-full p-3.5 rounded-xl border-2 outline-none focus:border-[#2f8d46] mb-4 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`} 
          />
          <button type="submit" className="w-full bg-[#2f8d46] text-white py-3.5 rounded-xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-500/20 flex justify-center items-center gap-2 outline-none">
            Notify Me <BellRing size={18}/>
          </button>
        </form>
      </div>
    </div>
  );
};


// --- AI CHATBOT COMPONENT ---
const ChatWidget = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm GeekBot 🤖. How can I help you with the GfG RIT Club today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // FIX 1: Corrected Chatbot URL
      const response = await fetch('https://gfg-ritclub.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error connecting to server. Is the Python backend running?", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`mb-4 w-[350px] h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border animate-scale-in origin-bottom-right ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="bg-[#2f8d46] p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">GeekBot AI</h3>
                <p className="text-xs text-green-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors outline-none">
              <X size={20} />
            </button>
          </div>

          <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#2f8d46] text-white rounded-br-none' 
                    : `${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white border border-gray-200 text-gray-800'} rounded-bl-none shadow-sm`
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                  <span className="w-2 h-2 rounded-full bg-[#2f8d46] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#2f8d46] animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 rounded-full bg-[#2f8d46] animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <div className={`flex items-center p-1 pl-4 rounded-full border focus-within:border-[#2f8d46] transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask GeekBot..." className="flex-1 bg-transparent outline-none text-sm" />
              <button type="submit" disabled={!input.trim()} className={`p-2 rounded-full transition-colors outline-none ${input.trim() ? 'bg-[#2f8d46] text-white' : 'text-gray-400 bg-transparent'}`}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`w-16 h-16 bg-[#2f8d46] text-white rounded-full flex items-center justify-center outline-none shadow-[0_0_20px_rgba(47,141,70,0.5)] hover:scale-110 transition-transform ${isOpen ? 'rotate-90 scale-90' : ''}`}>
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);       
  const [showProfileMenu, setShowProfileMenu] = useState(false); 
  const [alertsOpen, setAlertsOpen] = useState(false);       
  const [activeReminderEvent, setActiveReminderEvent] = useState(null); 
  
  const [events, setEvents] = useState([]);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gfg_rit_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [loginForm, setLoginForm] = useState({
    name: '', email: '', rollNo: '', phone: '', password: ''
  });

  const [timeLeft, setTimeLeft] = useState({ days: 9, hours: 20, mins: 18, secs: 26 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEvents = async () => {
    try {
      // FIX 2: Corrected Events URL
      const response = await fetch('https://gfg-ritclub.onrender.com/api/events');
      if(response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) { console.error("Error fetching events:", error); }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const loggedInUser = { ...loginForm, role: "user" };
    setUser(loggedInUser);
    localStorage.setItem('gfg_rit_user', JSON.stringify(loggedInUser));
    setShowLoginModal(false);
    setLoginForm({ name: '', email: '', rollNo: '', phone: '', password: '' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gfg_rit_user');
    setShowProfileMenu(false);
    setIsMenuOpen(false); 
  };

  const toggleProfile = () => { setShowProfileMenu(!showProfileMenu); setIsMenuOpen(false); setAlertsOpen(false); };
  const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); setShowProfileMenu(false); setAlertsOpen(false); };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Club Info', path: '/about', icon: <Users size={20} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Resources', path: '/resources', icon: <BookOpen size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { name: 'Support', path: '/contact', icon: <LifeBuoy size={20} /> },
  ];

  const NotificationPanel = () => (
    <div className={`p-4 rounded-3xl border shadow-xl ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
      <div className="flex items-center gap-2 text-[#2f8d46] font-black text-xs uppercase tracking-widest mb-3">
        <BellRing size={16} /> Upcoming Event
      </div>
      <h4 className="text-2xl font-black mb-3">DSA Bootcamp</h4>
      
      <div className={`space-y-2 text-sm font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p className="flex items-center gap-2"><Calendar size={16}/> 25 March 2026</p>
        <p className="flex items-center gap-2"><Clock size={16}/> 10:00 AM</p>
        <p className="flex items-center gap-2"><MapPin size={16}/> Green Building, 4th Floor — Wozniak Auditorium</p>
      </div>

      <button onClick={() => setActiveReminderEvent("DSA Bootcamp")} className="text-yellow-600 dark:text-yellow-500 text-sm font-bold flex items-center gap-2 mb-5 hover:underline outline-none">
        <Bell size={16} /> Click the bell to get a reminder email
      </button>
      
      <div className="flex justify-center gap-3">
        {[
          { label: 'DAYS', value: timeLeft.days },
          { label: 'HRS', value: timeLeft.hours },
          { label: 'MINS', value: timeLeft.mins },
          { label: 'SECS', value: String(timeLeft.secs).padStart(2, '0') }
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <span className="text-2xl font-black text-[#2f8d46]">{item.value}</span>
            <span className="text-[10px] font-bold text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileDropdown = () => (
    <div className={`absolute right-0 top-full mt-3 w-80 rounded-3xl shadow-2xl border overflow-hidden animate-scale-in z-[100] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`p-6 border-b flex items-center gap-4 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2f8d46] to-green-400 text-white flex items-center justify-center font-black text-xl shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className={`font-black text-xl leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="p-6 space-y-4 text-sm">
        <div className="flex justify-between items-center border-b border-gray-700/30 pb-2">
          <span className="text-gray-500 font-medium">Username</span>
          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-700/30 pb-2">
          <span className="text-gray-500 font-medium">Register No</span>
          <span className={`font-mono font-bold px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>{user.rollNo}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-700/30 pb-2">
          <span className="text-gray-500 font-medium">Phone No</span>
          <span className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.phone}</span>
        </div>
        <div className="flex justify-between items-center pb-2">
          <span className="text-gray-500 font-medium">Password</span>
          <span className={`font-mono font-bold tracking-widest px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>{user.password}</span>
        </div>
      </div>
      <div className="p-3 border-t border-gray-700/50 bg-red-500/5">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all text-base outline-none">
          <LogOut size={20} /> Log Out from Account
        </button>
      </div>
    </div>
  );

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        
        <NavigationButton />
        <ChatWidget darkMode={darkMode} />
        
        {/* RENDER THE MODAL IF ACTIVE */}
        {activeReminderEvent && (
          <ReminderModal 
            darkMode={darkMode} 
            user={user} 
            eventTitle={activeReminderEvent} 
            onClose={() => setActiveReminderEvent(null)} 
          />
        )}

        <nav className={`sticky top-0 z-50 shadow-md backdrop-blur-md ${darkMode ? 'bg-gray-900/95 border-b border-gray-800' : 'bg-white/95 border-b border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              
              <Link to="/" className="flex items-center gap-3 outline-none" onClick={() => {setIsMenuOpen(false); setShowProfileMenu(false); setAlertsOpen(false);}}>
                <div className="w-12 h-12 bg-[#2f8d46] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-green-500/30">G</div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">GfG RIT</h1>
                  <p className="text-[11px] font-bold text-[#2f8d46] tracking-widest uppercase">Campus Club</p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center space-x-2">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-bold transition-all hover:bg-[#2f8d46] hover:text-white outline-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{link.name}</Link>
                ))}
              </div>

              <div className="flex items-center gap-3 relative">
                
                <div className="hidden lg:block relative">
                  <button onClick={() => {setAlertsOpen(!alertsOpen); setShowProfileMenu(false);}} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative outline-none">
                    <Bell size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                  </button>
                  {alertsOpen && (
                    <div className={`absolute right-0 top-full mt-3 w-80 rounded-3xl shadow-2xl border animate-scale-in z-[100] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="p-2"><NotificationPanel /></div>
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="relative">
                    <button onClick={toggleProfile} className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all border outline-none ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-500' : 'bg-gray-100 border-gray-200 hover:border-gray-300'} shadow-sm`}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2f8d46] to-green-400 text-white flex items-center justify-center font-black text-sm shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown size={16} className={`text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showProfileMenu && <ProfileDropdown />}
                  </div>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#2f8d46] text-white hover:bg-green-700 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 outline-none">
                    <LogIn size={18} /> <span className="hidden sm:inline">Login</span>
                  </button>
                )}

                <button onClick={toggleMenu} className={`p-2 rounded-xl transition-all border outline-none ${isMenuOpen ? 'bg-[#2f8d46]/10 text-[#2f8d46] border-[#2f8d46]/30' : darkMode ? 'text-gray-300 border-gray-800 hover:bg-gray-800' : 'text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                  {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

                {isMenuOpen && (
                  <div className={`absolute right-0 top-full mt-3 w-[340px] max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border animate-scale-in z-[100] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="p-5 space-y-5">
                      
                      <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search events & resources..." className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all focus:border-[#2f8d46] border-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-black'}`} />
                      </div>

                      {user && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-100'}`}>
                            <Flame size={24} className="text-orange-500 mb-1" />
                            <span className={`font-black text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>12 Days</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Streak</span>
                          </div>
                          <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-100'}`}>
                            <Trophy size={24} className="text-purple-500 mb-1" />
                            <span className={`font-black text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Rank #3</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Leaderboard</span>
                          </div>
                        </div>
                      )}

                      <div className={`rounded-2xl border overflow-hidden transition-all ${darkMode ? 'border-gray-700 bg-gray-800/40' : 'border-gray-200 bg-gray-50'}`}>
                        <button onClick={() => setAlertsOpen(!alertsOpen)} className="w-full flex items-center justify-between p-4 font-bold text-sm outline-none">
                          <div className="flex items-center gap-2">
                            <Bell size={18} className={darkMode ? "text-blue-400" : "text-blue-600"} />
                            Club Alerts
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">1 NEW</span>
                            <ChevronDown size={16} className={`text-gray-500 transition-transform ${alertsOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {alertsOpen && (
                          <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <NotificationPanel />
                          </div>
                        )}
                      </div>

                      <div className="lg:hidden space-y-1 py-2 border-y border-gray-700/30">
                        {navLinks.map((link) => (
                          <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all outline-none ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-green-50'}`}>
                            <span className="text-[#2f8d46]">{link.icon}</span>{link.name}
                          </Link>
                        ))}
                      </div>

                      <button onClick={() => setDarkMode(!darkMode)} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all border outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black shadow-sm'}`}>
                        <div className="flex items-center gap-2">
                          {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
                          Appearance Mode
                        </div>
                        <span className={`text-[11px] uppercase tracking-wider font-black px-2.5 py-1.5 rounded-lg ${darkMode ? 'bg-black/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {darkMode ? 'Dark' : 'Light'}
                        </span>
                      </button>

                      <div className="flex gap-3">
                        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all outline-none ${darkMode ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-green-50 border-green-100 text-green-600 hover:bg-green-600 hover:text-white'}`}>
                          <MessageCircle size={16} /> WhatsApp
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-white hover:text-black' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-black hover:text-white'}`}>
                          <Github size={16} /> GitHub
                        </a>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<HomePortal darkMode={darkMode} />} />
            <Route path="/about" element={<AboutComponent darkMode={darkMode} />} />
            <Route path="/events" element={<EventsComponent darkMode={darkMode} events={events} user={user} setShowLoginModal={setShowLoginModal} setActiveReminderEvent={setActiveReminderEvent} />} />
            <Route path="/resources" element={<ResourcesComponent darkMode={darkMode} />} />
            <Route path="/leaderboard" element={<LeaderboardComponent darkMode={darkMode} user={user} />} />
            <Route path="/contact" element={<ContactComponent darkMode={darkMode} user={user} />} />
            <Route path="/admin" element={<AdminDashboard darkMode={darkMode} events={events} fetchEvents={fetchEvents} />} />
            <Route path="/student-portal" element={<StudentPortal user={user} />} />
          </Routes>
        </main>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className={`max-w-md w-full my-8 p-8 rounded-3xl shadow-2xl animate-scale-in ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
              <div className="w-16 h-16 bg-[#2f8d46]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users size={32} className="text-[#2f8d46]" />
              </div>
              <h3 className="text-3xl font-black mb-2 text-center">Join the Club</h3>
              <p className="text-gray-500 text-center mb-8">Please enter your complete details to sign in.</p>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Username</label>
                  <input required placeholder="Your Full Name" value={loginForm.name} onChange={(e) => setLoginForm({...loginForm, name: e.target.value})} className={`w-full p-3.5 rounded-xl border-2 outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">College Email</label>
                  <input required type="email" placeholder="student@rit.edu" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className={`w-full p-3.5 rounded-xl border-2 outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Register No.</label>
                    <input required placeholder="e.g., 341" value={loginForm.rollNo} onChange={(e) => setLoginForm({...loginForm, rollNo: e.target.value})} className={`w-full p-3.5 rounded-xl border-2 outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Phone</label>
                    <input required placeholder="+91..." value={loginForm.phone} onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})} className={`w-full p-3.5 rounded-xl border-2 outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Password</label>
                  <input required type="password" placeholder="••••••••" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className={`w-full p-3.5 rounded-xl border-2 outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                <div className="pt-4 space-y-3">
                  <button type="submit" className="w-full bg-[#2f8d46] text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-500/20 hover:bg-green-700 transition outline-none">
                    Secure Login
                  </button>
                  <button type="button" onClick={() => setShowLoginModal(false)} className="w-full py-3 text-gray-500 font-bold hover:text-gray-300 transition outline-none">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

// --- HOME COMPONENT ---
const HomePortal = ({ darkMode }) => (
  <div className="flex flex-col items-center justify-center mt-4 animate-fade-in-up">
    
    <div className={`w-full max-w-4xl p-10 md:p-16 rounded-[2rem] mb-12 text-center border transition-colors ${darkMode ? 'bg-green-900/10 border-green-500/20' : 'bg-green-50 border-green-100 shadow-xl shadow-green-100'}`}>
      <h1 className="text-4xl md:text-5xl font-black mb-6">Welcome to GfG Campus Club — RIT</h1>
      <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Join our coding community to master in courses, participate in hackathons, and level up your skill.
      </p>
      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-block bg-[#2f8d46] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all hover:-translate-y-1 outline-none">
        Join the Community
      </a>
    </div>

    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
      <Link to="/student-portal" className={`group flex flex-col items-center justify-center p-10 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-[#2f8d46]' : 'bg-white border-gray-200 hover:shadow-xl'}`}>
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"><Users size={48} className="text-[#2f8d46]" /></div>
        <h2 className="text-3xl font-black mb-3">Student / User</h2>
        <p className="text-center text-gray-500">Access resources and register for events.</p>
      </Link>
      <Link to="/admin" className={`group flex flex-col items-center justify-center p-10 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-[#2f8d46]' : 'bg-white border-gray-200 hover:shadow-xl'}`}>
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900/50 rounded-full flex items-center justify-center mb-6"><LayoutDashboard size={48} className="text-[#2f8d46]" /></div>
        <h2 className="text-3xl font-black mb-3">GfG Member / Admin</h2>
        <p className="text-center text-gray-500">Manage events and club activities.</p>
      </Link>
    </div>
  </div>
);

// --- ABOUT COMPONENT ---
const AboutComponent = ({ darkMode }) => {
  const generateStreak = () => Array.from({ length: 84 }).map(() => Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0);
  const colorMap = ['bg-gray-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-400'];

  return (
    <div className="animate-fade-in-up">
      <div className="w-full bg-[#2f8d46]/10 border border-[#2f8d46]/20 rounded-xl p-3 mb-10 overflow-hidden flex items-center gap-3">
        <TrendingUp size={20} className="text-[#2f8d46] shrink-0" />
        <marquee className="text-sm font-bold text-[#2f8d46]">
          🚀 UPCOMING: Hackathon 2026 Registrations are now OPEN! • 🏆 Congrats to Team Alpha for winning the CodeFest • 📚 New POTD dropped on Learning Resources!
        </marquee>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
            <h3 className="text-2xl font-bold mb-4 text-[#2f8d46] flex items-center gap-2"><Star size={24}/> Mission</h3>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Building a strong programming culture at RIT through DSA, Agentic Automation, and intense Hackathons. We bridge the gap between academia and the tech industry.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="text-[#2f8d46]"/> Top Geek Streaks</h3>
            <div className="space-y-6">
              {['Priya V. (145 Day Streak)', 'Arjun M. (92 Day Streak)'].map((name, idx) => (
                <div key={idx}>
                  <p className="text-sm font-bold mb-2 text-gray-400">{name}</p>
                  <div className="flex gap-1 flex-wrap">
                    {generateStreak().map((val, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${darkMode ? colorMap[val] : (val === 0 ? 'bg-gray-200' : colorMap[val])}`} title={`${val} submissions`}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
          <h3 className="text-2xl font-bold mb-6 text-[#2f8d46] flex items-center gap-2"><Briefcase size={24}/> Alumni Hall of Fame</h3>
          <div className="relative border-l-2 border-[#2f8d46]/30 pl-6 space-y-8">
            <div className="relative">
              <div className="absolute w-4 h-4 bg-[#2f8d46] rounded-full -left-[33px] top-1 border-4 border-gray-900"></div>
              <h4 className="font-bold text-lg">Rahul Kumar</h4>
              <p className="text-sm text-gray-400">SDE II at Amazon • Class of '24</p>
            </div>
            <div className="relative">
              <div className="absolute w-4 h-4 bg-[#2f8d46] rounded-full -left-[33px] top-1 border-4 border-gray-900"></div>
              <h4 className="font-bold text-lg">Sneha Patel</h4>
              <p className="text-sm text-gray-400">ML Engineer at Google • Class of '23</p>
            </div>
            <div className="relative">
              <div className="absolute w-4 h-4 bg-[#2f8d46] rounded-full -left-[33px] top-1 border-4 border-gray-900"></div>
              <h4 className="font-bold text-lg">Aditi Sharma</h4>
              <p className="text-sm text-gray-400">Founder, EcoTech • Class of '22</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NEW: REDESIGNED RESOURCES COMPONENT ---
const ResourcesComponent = ({ darkMode }) => {
  const [code, setCode] = useState("# Write your solution here\n\ndef trap(height):\n    pass\n");
  const skillNodes = [ { name: "Arrays & Strings", done: true }, { name: "Linked Lists", done: true }, { name: "Stacks & Queues", done: false }, { name: "Trees & Graphs", done: false }, { name: "Dynamic Programming", done: false } ];

  // NEW OFFICIAL GFG COURSES LIST TO MATCH IMAGE
  const courses = [
    { 
      title: "MASTERING DSA", 
      subtitle: "GFG OFFICIAL", 
      icon: <Layers size={24} className="text-blue-500" />, 
      iconBg: "bg-blue-500/10", 
      link: "https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/" 
    },
    { 
      title: "DBMS ROADMAP", 
      subtitle: "GFG OFFICIAL", 
      icon: <Database size={24} className="text-purple-500" />, 
      iconBg: "bg-purple-500/10", 
      link: "https://www.geeksforgeeks.org/dbms/" 
    },
    { 
      title: "OPERATING SYSTEMS", 
      subtitle: "GFG OFFICIAL", 
      icon: <Cpu size={24} className="text-orange-500" />, 
      iconBg: "bg-orange-500/10", 
      link: "https://www.geeksforgeeks.org/operating-systems/" 
    },
    { 
      title: "PYTHON GUIDE", 
      subtitle: "GFG OFFICIAL", 
      icon: <Code size={24} className="text-green-500" />, 
      iconBg: "bg-green-500/10", 
      link: "https://www.geeksforgeeks.org/python-programming-language/" 
    }
  ];

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto">
      
      {/* --- NEW RESOURCE HUB HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-4">
        <h2 className="text-3xl font-black flex items-center gap-3 italic tracking-wide uppercase">
          <BookOpen className="text-[#2f8d46]" size={32} /> RESOURCE HUB
        </h2>
        <a href="https://share.google/SXt7ypCSCqZBPyNOJ" target="_blank" rel="noreferrer" className="text-[#2f8d46] font-bold text-sm flex items-center gap-1 hover:underline tracking-widest uppercase outline-none transition-all hover:gap-2">
          Explore More <ChevronRight size={16} />
        </a>
      </div>

      {/* --- NEW 4-CARD GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {courses.map((course, i) => (
          <a href={course.link} target="_blank" rel="noreferrer" key={i} className={`p-6 rounded-3xl border transition-all hover:-translate-y-1 block outline-none ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-500 shadow-lg' : 'bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-300'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${course.iconBg}`}>
              {course.icon}
            </div>
            <h3 className="font-black text-[15px] uppercase mb-1 tracking-tight">{course.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{course.subtitle}</p>
          </a>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className={`p-6 rounded-3xl border border-orange-500/30 shadow-lg shadow-orange-500/10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Star className="text-orange-500" size={20} /> POTD</h3>
              <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-bold">Hard</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Trapping Rain Water</h4>
            <p className="text-sm text-gray-400 mb-6">Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Paste GfG submission link" className={`flex-1 p-3 rounded-xl border text-sm outline-none ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
              <button className="bg-orange-500 text-white px-4 rounded-xl font-bold hover:bg-orange-600 transition outline-none">Submit</button>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-[#2f8d46]" size={20} /> DSA Skill Tree</h3>
            <div className="space-y-4">
              {skillNodes.map((node, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  {node.done ? <CheckSquare className="text-[#2f8d46]" /> : <Square className="text-gray-600 group-hover:text-gray-400 transition" />}
                  <span className={`font-bold ${node.done ? 'text-gray-300 line-through opacity-50' : ''}`}>{node.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`lg:col-span-8 p-6 rounded-3xl border flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><Terminal className="text-[#2f8d46]" size={20} /> Mini Compiler</h3>
            <button className="flex items-center gap-2 bg-[#2f8d46] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition outline-none">
              <Play size={16} /> Run Code
            </button>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-700 min-h-[400px]">
            <Editor height="100%" defaultLanguage="python" theme={darkMode ? "vs-dark" : "light"} value={code} onChange={(value) => setCode(value)} options={{ minimap: { enabled: false }, fontSize: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- EVENTS COMPONENT ---
const EventsComponent = ({ darkMode, events, user, setShowLoginModal, setActiveReminderEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regData, setRegData] = useState({ name: '', rollNo: '', email: '' });
  const [ticket, setTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) setRegData(prev => ({ ...prev, email: user.email, name: user.name, rollNo: user.rollNo }));
  }, [user]);

  const handleRegisterClick = (event) => {
    if (!user) { alert("Please Login first to register for events!"); setShowLoginModal(true); } 
    else { setSelectedEvent(event); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ticketInfo = { name: regData.name, rollNo: regData.rollNo, email: regData.email, eventTitle: selectedEvent.title, ticketId: `GFG-${Math.floor(Math.random() * 10000)}` };

    try {
      // FIX 3: Corrected Registration URL
      const response = await fetch('https://gfg-ritclub.onrender.com/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ticketInfo) });
      if (response.ok) { setTicket(ticketInfo); setSelectedEvent(null); } 
      else if (response.status === 400) { const errorData = await response.json(); alert(`Registration Denied: ${errorData.detail}`); } 
      else { alert("Server error during registration."); }
    } catch (error) { alert("Could not connect to the database."); }
    finally { setIsSubmitting(false); }
  };

  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', [100, 150]); const greenColor = [47, 141, 70];
      pdf.setFillColor(...greenColor); pdf.rect(0, 0, 100, 20, 'F');
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(18); pdf.setFont('helvetica', 'bold'); pdf.text('G', 48, 12);
      pdf.setTextColor(0, 0, 0); pdf.setFontSize(12); pdf.text('GFG RIT ENTRY PASS', 50, 30, { align: 'center' });
      const qrData = JSON.stringify(ticket); const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      pdf.addImage(qrCodeDataUrl, 'PNG', 25, 40, 50, 50);
      pdf.setFontSize(12); pdf.text(ticket.eventTitle.toUpperCase(), 50, 100, { align: 'center' });
      pdf.setDrawColor(200, 200, 200); pdf.line(10, 110, 90, 110);
      pdf.setFontSize(10); pdf.setTextColor(100, 100, 100); pdf.text('ATTENDEE', 10, 120);
      pdf.setTextColor(0, 0, 0); pdf.setFontSize(12); pdf.text(`${ticket.name} (${ticket.rollNo})`, 10, 128);
      pdf.setFillColor(...greenColor); pdf.rect(0, 145, 100, 5, 'F');
      pdf.save(`${ticket.name.replace(/\s+/g, '_')}_Ticket.pdf`);
    } catch (err) { alert("PDF generation failed."); }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-4xl font-extrabold mb-8 flex items-center gap-3"><Calendar className="text-[#2f8d46]"/> Event Management</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {events.length === 0 ? <p className="text-gray-500 col-span-3">No events currently scheduled in the database.</p> : events.map((event, i) => (
          <div key={i} className={`p-6 rounded-3xl border flex flex-col justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
            <div>
              <p className="text-xs font-bold text-[#2f8d46] mb-3 uppercase tracking-widest flex items-center gap-2"><Bell size={14}/> UPCOMING EVENT</p>
              <h3 className="text-2xl font-black mb-4">{event.title}</h3>
              <p className="text-sm text-gray-400 mb-2 flex gap-2 items-center"><Calendar size={16}/> {event.date}</p>
              <p className="text-sm text-gray-400 flex gap-2 items-center mb-4"><MapPin size={16}/> {event.location}</p>
              
              <button 
                onClick={() => setActiveReminderEvent(event.title)} 
                className="flex items-center gap-2 text-sm font-bold text-yellow-500 mb-8 hover:text-yellow-600 transition-colors outline-none"
              >
                <BellRing size={16} /> Click the bell to get a reminder email
              </button>
            </div>
            
            <button onClick={() => handleRegisterClick(event)} className="w-full bg-[#2f8d46] text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 outline-none">
              Register Now
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`max-w-md w-full p-8 rounded-3xl ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
            <h3 className="text-2xl font-black mb-4">Register for {selectedEvent.title}</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input required placeholder="Full Name" className="w-full p-3 rounded-xl border bg-transparent" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} disabled={!!user} />
              <input required placeholder="Roll Number" className="w-full p-3 rounded-xl border bg-transparent" value={regData.rollNo} onChange={e => setRegData({...regData, rollNo: e.target.value})} disabled={!!user} />
              <input required type="email" placeholder="Email" className="w-full p-3 rounded-xl border bg-transparent opacity-50 cursor-not-allowed" value={regData.email} disabled />
              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={isSubmitting} className={`flex-1 text-white py-3 rounded-xl font-bold transition-all outline-none ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2f8d46] hover:bg-green-700'}`}>
                  {isSubmitting ? "Generating QR Ticket..." : "Confirm Entry"}
                </button>
                <button type="button" onClick={() => setSelectedEvent(null)} className="px-4 py-3 text-gray-500 outline-none">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-sm w-full animate-scale-in">
            <div id="ticket-receipt" className="bg-white text-black p-8 rounded-t-3xl border-b-2 border-dashed border-gray-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#2f8d46] rounded-lg text-white flex items-center justify-center font-black mb-2">G</div>
                <h4 className="font-black text-xl">GFG RIT ENTRY PASS</h4>
                <div className="my-6 p-2 bg-white rounded-xl shadow-inner">
                  <QRCodeSVG value={JSON.stringify(ticket)} size={150} />
                </div>
                <p className="font-bold text-lg uppercase">{ticket.eventTitle}</p>
                <div className="mt-4 text-left w-full border-t pt-4 space-y-1">
                  <p className="text-xs uppercase text-gray-500">Attendee</p>
                  <p className="font-bold">{ticket.name} ({ticket.rollNo})</p>
                </div>
              </div>
            </div>
            <button onClick={downloadPDF} className="w-full bg-[#2f8d46] text-white py-4 rounded-b-3xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition outline-none">
              <Award size={20}/> Download Ticket (PDF)
            </button>
            <button onClick={() => setTicket(null)} className="w-full text-white mt-4 opacity-50 text-sm hover:opacity-100 transition outline-none">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LEADERBOARD COMPONENT ---
const LeaderboardComponent = ({ darkMode, user }) => {
  const leaderboardData = [
    { rank: 1, name: "Priya V.", roll: "102", score: 2450, streak: 145 },
    { rank: 2, name: "Arjun M.", roll: "405", score: 2310, streak: 92 },
    { rank: 3, name: user ? user.name : "Sandy", roll: user ? user.rollNo : "341", score: 2100, streak: 45 },
    { rank: 4, name: "Neha K.", roll: "211", score: 1950, streak: 30 },
    { rank: 5, name: "Rahul S.", roll: "503", score: 1840, streak: 22 },
  ];

  const getMedalColor = (rank) => {
    if (rank === 1) return "text-yellow-400"; 
    if (rank === 2) return "text-gray-300";   
    if (rank === 3) return "text-amber-600";  
    return "text-transparent";
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <Trophy size={64} className="mx-auto text-[#2f8d46] mb-4" />
        <h2 className="text-4xl font-extrabold flex items-center justify-center gap-3">Campus Leaderboard</h2>
        <p className="text-gray-500 mt-2">Ranking the top problem solvers of RIT based on POTD and Hackathons.</p>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-xl'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-sm uppercase tracking-wider ${darkMode ? 'border-gray-700 bg-gray-900/50 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                <th className="p-5 font-bold text-center">Rank</th>
                <th className="p-5 font-bold">Geek</th>
                <th className="p-5 font-bold text-center">Current Streak</th>
                <th className="p-5 font-bold text-right">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((student, i) => (
                <tr key={i} className={`border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-100'} ${user && student.name === user.name ? 'bg-[#2f8d46]/10' : ''}`}>
                  <td className="p-5 text-center">
                    <div className="flex justify-center items-center gap-1">
                      {student.rank <= 3 && <Medal size={20} className={getMedalColor(student.rank)} />}
                      <span className={`font-black text-lg ${student.rank <= 3 ? darkMode ? 'text-white' : 'text-gray-900' : 'text-gray-500'}`}>{student.rank}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-[16px]">{student.name}</p>
                    <p className="text-xs text-gray-500">Roll: {student.roll}</p>
                  </td>
                  <td className="p-5 text-center">
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-bold flex items-center justify-center gap-1 w-max mx-auto">
                      🔥 {student.streak} Days
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono font-bold text-[#2f8d46] text-lg">
                    {student.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- CONTACT COMPONENT ---
const ContactComponent = ({ darkMode, user }) => {
  const [ticketMsg, setTicketMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketId(`TKT-${Math.floor(Math.random() * 100000)}`);
    setSubmitted(true);
    setTicketMsg('');
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold flex items-center justify-center gap-3"><LifeBuoy className="text-[#2f8d46]"/> Support & Ticketing</h2>
        <p className="text-gray-500 mt-2">Get help from the GfG RIT core team or browse our FAQs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className={`p-8 rounded-3xl border flex flex-col justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><MessageSquare className="text-[#2f8d46]"/> Quick FAQs</h3>
            <div className="space-y-4">
              <details className={`p-4 rounded-xl border cursor-pointer group ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <summary className="font-bold outline-none">How do I join the core team?</summary>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed border-t border-gray-700 pt-4">Recruitments happen every August. Keep an eye on the announcements page for the Google Form link.</p>
              </details>
              <details className={`p-4 rounded-xl border cursor-pointer group ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <summary className="font-bold outline-none">Can I participate in events without an account?</summary>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed border-t border-gray-700 pt-4">No. You must create an account and log in to generate an official entry ticket.</p>
              </details>
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Mail className="text-[#2f8d46]"/> Raise a Ticket</h3>
          
          {submitted ? (
            <div className="text-center py-8 animate-scale-in">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-[#2f8d46]" />
              </div>
              <h4 className="text-xl font-bold mb-2">Ticket Submitted!</h4>
              <p className="text-gray-500 mb-4">Your reference ID is:</p>
              <div className="text-2xl font-mono font-black text-[#2f8d46] bg-[#2f8d46]/10 py-3 rounded-xl mb-6">{ticketId}</div>
              <button onClick={() => setSubmitted(false)} className="text-sm font-bold text-gray-500 hover:text-gray-300 outline-none">Submit another query</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={user ? user.name : ''} placeholder="Your Name (Login required to auto-fill)" disabled={!!user} className={`w-full p-4 rounded-xl border outline-none ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} ${user ? 'opacity-50 cursor-not-allowed' : ''}`} />
              <textarea required rows="4" placeholder="Describe your issue or query in detail..." value={ticketMsg} onChange={(e)=>setTicketMsg(e.target.value)} className={`w-full p-4 rounded-xl border outline-none focus:border-[#2f8d46] resize-none ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}></textarea>
              <button type="submit" className="w-full bg-[#2f8d46] text-white py-4 rounded-xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-500/20 outline-none">Submit Support Ticket</button>
            </form>
          )}
        </div>

        <div className={`md:col-span-2 p-8 rounded-3xl mt-4 ${darkMode ? 'bg-green-950/30' : 'bg-[#1d4c2b]'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white mb-4">GfG Campus Club — RIT</h4>
              <p className="text-green-100/80 text-lg">Rajalakshmi Institute of Technology</p>
              <p className="text-green-100/80 text-lg">Kuthambakkam, Chennai — 600 124</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-black text-[#4caf50] uppercase tracking-widest mb-4">Contact</h4>
              <a href="mailto:geeksforgeeks@ritchennai.edu.in" className="flex items-center gap-3 text-green-100 hover:text-white transition-colors text-lg outline-none">
                <Mail size={20} /> geeksforgeeks@ritchennai.edu.in
              </a>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-green-100/60 text-sm">© 2026 GfG Campus Club, RIT. All rights reserved.</p>
            <a href="https://www.geeksforgeeks.org/" target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-[#2f8d46] text-white font-bold rounded-lg text-sm hover:bg-green-700 transition outline-none">
              GeeksforGeeks
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;