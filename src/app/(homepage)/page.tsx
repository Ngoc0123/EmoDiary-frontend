"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Volume2, 
  VolumeX, 
  User, 
  LogOut, 
  Calendar, 
  BookOpen, 
  Clock,
  ChevronDown,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";

// Flag component for Vietnam
const VietnamFlag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#DA251D" rx="2"/>
    <path 
      d="M15 4L16.545 8.755H21.545L17.5 11.745L19.045 16.5L15 13.51L10.955 16.5L12.5 11.745L8.455 8.755H13.455L15 4Z" 
      fill="#FFFF00"
    />
  </svg>
);

// Flag component for USA/English
const USAFlag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#FFFFFF" rx="2"/>
    <rect width="30" height="1.54" fill="#B22234"/>
    <rect y="3.08" width="30" height="1.54" fill="#B22234"/>
    <rect y="6.15" width="30" height="1.54" fill="#B22234"/>
    <rect y="9.23" width="30" height="1.54" fill="#B22234"/>
    <rect y="12.31" width="30" height="1.54" fill="#B22234"/>
    <rect y="15.38" width="30" height="1.54" fill="#B22234"/>
    <rect y="18.46" width="30" height="1.54" fill="#B22234"/>
    <rect width="12" height="10.77" fill="#3C3B6E"/>
  </svg>
);

export default function Home() {
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'vi' as const, name: 'Tiếng Việt', Flag: VietnamFlag },
    { code: 'en' as const, name: 'English', Flag: USAFlag },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const menuButtons = [
    {
      id: "diem-danh",
      label: t.home.attendance,
      icon: Calendar,
      gradient: "from-amber-400 to-orange-500",
      shadowColor: "shadow-orange-300/50",
      href: "/diem-danh",
    },
    {
      id: "thu-vien",
      label: t.home.library,
      icon: BookOpen,
      gradient: "from-emerald-400 to-teal-500",
      shadowColor: "shadow-teal-300/50",
      href: "/thu-vien",
    },
    {
      id: "lich-su-cam-xuc",
      label: t.home.emotionHistory,
      icon: Clock,
      gradient: "from-violet-400 to-purple-500",
      shadowColor: "shadow-purple-300/50",
      href: "/lich-su-cam-xuc",
    },
  ];

  const handleLanguageSelect = (langCode: 'vi' | 'en') => {
    setLanguage(langCode);
    setIsLanguageOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background - Leave blank for now, ready for image */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50"
        style={{
          // backgroundImage: 'url("/your-background-image.jpg")',
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
        }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      {/* Top Right Control Bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
        {/* Audio Mute Button */}
        <button
          id="audio-toggle"
          onClick={() => setIsMuted(!isMuted)}
          className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" />
          ) : (
            <Volume2 className="h-5 w-5 text-slate-600 transition-colors group-hover:text-emerald-500" />
          )}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            id="language-toggle"
            onClick={() => {
              setIsLanguageOpen(!isLanguageOpen);
              setIsMenuOpen(false);
            }}
            className="group relative flex h-12 w-14 items-center justify-center gap-1 rounded-xl bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white"
            title="Change Language"
          >
            <currentLang.Flag className="h-5 w-7 rounded-sm shadow-sm" />
            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Language Dropdown */}
          {isLanguageOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 rounded-xl bg-white/95 backdrop-blur-xl shadow-xl shadow-black/10 border border-white/50 overflow-hidden animate-fade-in">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  id={`lang-${lang.code}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-100 ${
                    language === lang.code ? 'bg-slate-50' : ''
                  }`}
                >
                  <lang.Flag className="h-4 w-6 rounded-sm shadow-sm" />
                  <span className="text-sm font-medium text-slate-700">{lang.name}</span>
                  {language === lang.code && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Dropdown Button */}
        <div className="relative">
          <button
            id="menu-toggle"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsLanguageOpen(false);
            }}
            className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white"
            title="Menu"
          >
            <div className="flex flex-col gap-1">
              <div className="h-0.5 w-5 rounded-full bg-slate-600 transition-all group-hover:bg-slate-800" />
              <div className="h-0.5 w-4 rounded-full bg-slate-500 transition-all group-hover:bg-slate-700" />
              <div className="h-0.5 w-3 rounded-full bg-slate-400 transition-all group-hover:bg-slate-600" />
            </div>
          </button>

          {/* Account Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-white/95 backdrop-blur-xl shadow-xl shadow-black/10 border border-white/50 overflow-hidden animate-fade-in">
              {isAuthenticated ? (
                <>
                  {/* Authenticated User Menu */}
                  <button
                    id="account-profile"
                    onClick={() => {
                      // Navigate to profile page
                      console.log("Navigate to profile");
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{t.nav.account}</span>
                  </button>
                  
                  <div className="h-px bg-slate-200 mx-3" />
                  
                  <button
                    id="logout-button"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-red-50 group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 group-hover:bg-red-100 transition-colors shadow-sm">
                      <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-red-600 transition-colors">{t.nav.logout}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Guest Menu */}
                  <Link
                    id="sign-in-button"
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-100 group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md group-hover:scale-105 transition-transform">
                      <LogIn className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{t.nav.signIn}</span>
                  </Link>
                  
                  <div className="h-px bg-slate-200 mx-3" />
                  
                  <Link
                    id="sign-up-button"
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-emerald-50 group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md group-hover:scale-105 transition-transform">
                      <UserPlus className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors">{t.nav.signUp}</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isLanguageOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsMenuOpen(false);
            setIsLanguageOpen(false);
          }}
        />
      )}

      {/* Navigation Buttons - Upper Right Area */}
      <nav className="absolute top-28 right-6 z-30 flex flex-col gap-4">
        {menuButtons.map((button, index) => {
          const IconComponent = button.icon;
          return (
            <Link
              key={button.id}
              id={button.id}
              href={button.href}
              className={`
                group relative flex items-center gap-3 px-6 py-4 
                bg-white/90 backdrop-blur-xl rounded-full
                shadow-lg ${button.shadowColor}
                border border-white/60
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-xl hover:-translate-x-2
                hover:bg-white
                animate-fade-in
              `}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon with gradient background */}
              <div className={`
                flex h-10 w-10 items-center justify-center rounded-full 
                bg-gradient-to-br ${button.gradient}
                shadow-md transition-transform duration-300 
                group-hover:scale-110 group-hover:rotate-6
              `}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              
              {/* Label */}
              <span className="text-base font-semibold text-slate-700 pr-2 whitespace-nowrap">
                {button.label}
              </span>

              {/* Hover indicator */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${button.gradient}`} />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Optional: Decorative elements to make the blank background more interesting */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none" />
      
      {/* Floating decorative shapes */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/30 blur-3xl pointer-events-none" />
    </div>
  );
}
