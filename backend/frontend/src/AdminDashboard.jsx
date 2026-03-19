import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, Calendar, Download, Users, ListFilter, Trash2 } from 'lucide-react';

const AdminDashboard = ({ darkMode, events, fetchEvents }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState('');
  
  const [activeTab, setActiveTab] = useState('events');
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);
  
  const [form, setForm] = useState({ title: '', date: '', location: '' });
  const VALID_ADMIN_ID = "GFGRIT_2026"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminId === VALID_ADMIN_ID) setIsAdmin(true);
    else alert("Invalid Admin ID.");
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      // LINK 1 UPDATED
      const response = await fetch('https://gfg-rit-club.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        if (fetchEvents) fetchEvents(); 
        setForm({ title: '', date: '', location: '' });
      } else {
        alert("Failed to save event. Check backend terminal.");
      }
    } catch (error) {
      console.error(error);
      alert("Could not connect! Is your Python FastAPI server running?");
    }
  };

  // --- NEW: DELETE EVENT LOGIC ---
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? It will be removed from the Student Portal immediately.")) return;

    try {
      // LINK 2 UPDATED
      const response = await fetch(`https://gfg-rit-club.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the global event list in App.jsx
        if (fetchEvents) fetchEvents();
      } else {
        alert("Failed to delete the event from the database.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not connect to the backend database.");
    }
  };

  const fetchRegistrations = async () => {
    setIsLoadingRegs(true);
    try {
      // LINK 3 UPDATED
      const response = await fetch('https://gfg-rit-club.onrender.com/api/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setIsLoadingRegs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations();
    }
  }, [activeTab]);

  const exportToCSV = async () => {
    try {
      // LINK 4 UPDATED
      const response = await fetch('https://gfg-rit-club.onrender.com/api/registrations');
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      
      if (data.length === 0) return alert("No registrations found in database.");

      const headers = ["Name", "Roll No", "Email", "Event Title", "Ticket ID"];
      const rows = data.map(reg => `"${reg.name}","${reg.rollNo}","${reg.email}","${reg.eventTitle}","${reg.ticketId}"`);
      const csvContent = [headers.join(","), ...rows].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `GfG_Registrations_${new Date().toLocaleDateString()}.csv`;
      link.click();
    } catch (error) {
      console.error(error);
      alert("Could not fetch registrations.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-in">
        <div className={`p-10 rounded-3xl border-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-xl'}`}>
          <LayoutDashboard size={64} className="text-[#2f8d46] mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">Admin Verification</h2>
          <input 
            type="password" 
            placeholder="Enter Admin ID" 
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className={`w-full p-4 rounded-xl border-2 mb-4 outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
          />
          <button onClick={handleLogin} className="w-full bg-[#2f8d46] text-white py-3 rounded-xl font-bold">Verify Access</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b pb-6 border-gray-700/30">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-3"><LayoutDashboard className="text-[#2f8d46]" /> Admin Control</h2>
          <p className="text-gray-500 mt-2">Manage events and monitor database registrations.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 bg-gray-200 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-300 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('events')} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'events' ? 'bg-[#2f8d46] text-white shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              <Calendar size={18}/> Events
            </button>
            <button 
              onClick={() => setActiveTab('registrations')} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'registrations' ? 'bg-[#2f8d46] text-white shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              <Users size={18}/> Registrations
            </button>
        </div>
      </div>

      {activeTab === 'events' && (
        <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
          <form onSubmit={handleAddEvent} className={`p-8 rounded-3xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
            <h3 className="text-xl font-bold mb-6 text-[#2f8d46] flex items-center gap-2"><PlusCircle size={20}/> Create New Event</h3>
            <div className="space-y-4">
              <input required placeholder="Event Title" className={`w-full p-3 rounded-xl border outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              <input required type="date" className={`w-full p-3 rounded-xl border outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
              <input required placeholder="Location (e.g. Lab 402)" className={`w-full p-3 rounded-xl border outline-none focus:border-[#2f8d46] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`} value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
              <button type="submit" className="w-full bg-[#2f8d46] text-white py-4 rounded-xl font-black hover:bg-green-700 transition">Publish to Database</button>
            </div>
          </form>

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListFilter size={20}/> Live Database List ({events ? events.length : 0})</h3>
            {!events || events.length === 0 ? <p className="text-gray-500 text-sm">No events found in SQLite.</p> : events.map((ev, i) => (
              <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between transition-all hover:-translate-y-1 ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white hover:shadow-md'}`}>
                <div>
                  <h4 className="font-bold text-lg">{ev.title}</h4>
                  <p className="text-sm text-gray-500">{ev.date} • {ev.location}</p>
                </div>
                
                {/* --- RESTORED DELETE BUTTON --- */}
                <button 
                  onClick={() => handleDeleteEvent(ev.id)} 
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete Event"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">Student Roster</h3>
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-500/20">
              <Download size={18}/> Export to CSV
            </button>
          </div>

          <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-sm uppercase tracking-wider ${darkMode ? 'border-gray-700 bg-gray-900/50 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                    <th className="p-5 font-bold">Name</th>
                    <th className="p-5 font-bold">Roll No</th>
                    <th className="p-5 font-bold">Event</th>
                    <th className="p-5 font-bold">Ticket ID</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingRegs ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500 animate-pulse">Loading database records...</td></tr>
                  ) : registrations.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No students have registered yet.</td></tr>
                  ) : (
                    registrations.map((student, i) => (
                      <tr key={i} className={`border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <td className="p-5">
                          <p className="font-bold text-[15px]">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </td>
                        <td className="p-5 font-mono text-sm">{student.rollNo}</td>
                        <td className="p-5 text-sm font-medium">{student.eventTitle}</td>
                        <td className="p-5">
                          <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs font-mono font-bold">
                            {student.ticketId}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;