"use client";

import Link from "next/link";
import {
  Volume2,
  VolumeX,
  User,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react";
import { LoginRequiredModal } from "@/components/ui/LoginRequiredModal";
import { MoodSelectModal } from "@/components/ui/MoodSelectModal";
import { useHomePage } from "./useHomePage";

const VietnamFlag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#DA251D" rx="2"/>
    <path
      d="M15 4L16.545 8.755H21.545L17.5 11.745L19.045 16.5L15 13.51L10.955 16.5L12.5 11.745L8.455 8.755H13.455L15 4Z"
      fill="#FFFF00"
    />
  </svg>
);

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

const LANGUAGES = [
  { code: 'vi' as const, name: 'Tiếng Việt', Flag: VietnamFlag },
  { code: 'en' as const, name: 'English', Flag: USAFlag },
];

export function HomePage() {
  const {
    isMuted,
    isMenuOpen,
    isLanguageOpen,
    isLoginModalOpen,
    isMoodModalOpen,
    isAuthenticated,
    language,
    t,
    toggleMute,
    toggleLanguageDropdown,
    toggleMenuDropdown,
    closeDropdowns,
    closeMenu,
    handleLanguageSelect,
    handleNavClick,
    handleMoodSelect,
    logout,
    setIsLoginModalOpen,
    setIsMoodModalOpen,
    navButtons,
  } = useHomePage();

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Top Right Control Bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {/* Volume Button */}
        <button
          id="audio-toggle"
          onClick={toggleMute}
          className="flex h-14 w-20 items-center justify-center rounded-[10px] border-2 border-black bg-[#dbb27d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95"
          title={isMuted ? t.nav.unmute : t.nav.mute}
        >
          {isMuted ? (
            <VolumeX className="h-7 w-7 text-[#4f310b]" />
          ) : (
            <Volume2 className="h-7 w-7 text-[#4f310b]" />
          )}
        </button>

        {/* Language Button */}
        <div className="relative">
          <button
            id="language-toggle"
            onClick={toggleLanguageDropdown}
            className="flex h-14 w-20 items-center justify-center gap-1.5 rounded-[10px] border-2 border-black bg-[#dbb27d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95"
            title={t.nav.changeLanguage}
          >
            <currentLang.Flag className="h-6 w-8 rounded-[5px] shadow-sm" />
            <ChevronDown className={`h-4 w-4 text-[#4f310b] transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLanguageOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 rounded-[10px] border-2 border-black bg-[#dbb27d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden z-50">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  id={`lang-${lang.code}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#c9a06b] ${
                    language === lang.code ? 'bg-[#c9a06b]' : ''
                  }`}
                >
                  <lang.Flag className="h-5 w-7 rounded-[3px] shadow-sm" />
                  <span className="text-sm font-semibold text-[#4f310b]">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <div className="relative">
          <button
            id="menu-toggle"
            onClick={toggleMenuDropdown}
            className="flex h-14 w-20 items-center justify-center rounded-[10px] border-2 border-black bg-[#dbb27d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95"
            title="Menu"
          >
            <Menu className="h-7 w-7 text-[#4f310b]" strokeWidth={2.5} />
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-[10px] border-2 border-black bg-[#dbb27d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden z-50">
              {isAuthenticated ? (
                <>
                  <button
                    id="account-profile"
                    onClick={closeMenu}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#c9a06b]"
                  >
                    <User className="h-5 w-5 text-[#4f310b]" />
                    <span className="text-sm font-semibold text-[#4f310b]">{t.nav.account}</span>
                  </button>
                  <div className="h-px bg-[#926e3f] mx-3" />
                  <button
                    id="logout-button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#c9a06b]"
                  >
                    <LogOut className="h-5 w-5 text-[#4f310b]" />
                    <span className="text-sm font-semibold text-[#4f310b]">{t.nav.logout}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    id="sign-in-button"
                    href="/sign-in"
                    onClick={closeMenu}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#c9a06b]"
                  >
                    <LogIn className="h-5 w-5 text-[#4f310b]" />
                    <span className="text-sm font-semibold text-[#4f310b]">{t.nav.signIn}</span>
                  </Link>
                  <div className="h-px bg-[#926e3f] mx-3" />
                  <Link
                    id="sign-up-button"
                    href="/sign-up"
                    onClick={closeMenu}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#c9a06b]"
                  >
                    <UserPlus className="h-5 w-5 text-[#4f310b]" />
                    <span className="text-sm font-semibold text-[#4f310b]">{t.nav.signUp}</span>
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
          onClick={closeDropdowns}
        />
      )}

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Mood Selection Modal */}
      <MoodSelectModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        onSelect={handleMoodSelect}
      />

      {/* Wooden Signpost Navigation */}
      <div className="absolute right-12 top-28 z-30 flex flex-col items-center">
        {/* Top horizontal plank */}
        <div className="h-6 w-[400px] rounded-[5px] border-2 border-black bg-[#926e3f]" />

        {/* Poles and buttons container */}
        <div className="relative w-[400px]">
          {/* Left vertical pole */}
          <div className="absolute left-[75px] top-0 bottom-8 w-5 border-2 border-black bg-[#4f310b]" />
          {/* Right vertical pole */}
          <div className="absolute right-[75px] top-0 bottom-8 w-5 border-2 border-black bg-[#4f310b]" />

          {/* Navigation plank buttons */}
          <div className="relative z-10 flex flex-col items-center gap-8 py-8">
            {navButtons.map((button) => (
              <Link
                key={button.id}
                id={button.id}
                href={button.href}
                onClick={(e) => handleNavClick(button.id, e)}
                className="flex h-[90px] w-[300px] items-center justify-center rounded-[30px] border-2 border-black bg-[#dbb27d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
              >
                <span
                  className="font-[var(--font-pacifico)] text-[#4f310b] text-[50px] leading-normal"
                  style={{ fontFamily: "var(--font-pacifico)" }}
                >
                  {button.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
