import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Users, LifeBuoy, Trophy, ArrowRight, Sparkles } from 'lucide-react';

const StudentPortal = ({ user }) => {
  const sections = [
    { title: "Club Information", icon: <Users className="text-[#2f8d46]" />, content: "Learn about GfG RIT's mission and core team.", link: "/about" },
    { title: "Event Management", icon: <Calendar className="text-[#2f8d46]" />, content: "Register for upcoming hackathons and workshops.", link: "/events" },
    { title: "Learning Resources", icon: <BookOpen className="text-[#2f8d46]" />, content: "Solve the POTD and use the Mini-Compiler.", link: "/resources" },
    { title: "Community Leaderboard", icon: <Trophy className="text-[#2f8d46]" />, content: "Check your rank on the campus leaderboard.", link: "/leaderboard" },
    { title: "Contact & Support", icon: <LifeBuoy className="text-[#2f8d46]" />, content: "Raise tickets and get help from the team.", link: "/contact" }
  ];

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto">
      
      {/* --- PERSONALIZED WELCOME BANNER --- */}
      <div className="relative overflow-hidden mb-12 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 border border-green-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 text-green-500/5">
          <Sparkles size={250} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-[#2f8d46] to-green-400 text-white flex items-center justify-center font-black text-5xl md:text-6xl shadow-lg border-4 border-gray-900">
            {user ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">
              Welcome back, <span className="text-[#2f8d46]">{user ? user.name : 'Geek'}</span>!
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium">Ready to crack some code and build amazing things today?</p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link to={section.link} key={index} className="no-underline group">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl hover:border-[#2f8d46] dark:hover:border-[#2f8d46] transition-all cursor-pointer h-full shadow-lg hover:shadow-[0_0_30px_rgba(47,141,70,0.15)] hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-between">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:bg-[#2f8d46]/10 transition-colors">
                  {section.icon}
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-[#2f8d46] transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{section.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {section.content}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentPortal;