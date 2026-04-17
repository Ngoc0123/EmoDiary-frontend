"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";
import { ApiError } from "@/components/http_request";
import { toast } from "sonner";
import type { MoodKey } from "@/components/ui/MoodSelectModal";

export function useHomePage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isCheckingAttendance, setIsCheckingAttendance] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = (langCode: 'vi' | 'en') => {
    setLanguage(langCode);
    setIsLanguageOpen(false);
  };

  const handleAttendanceClick = async () => {
    if (isCheckingAttendance) return;
    setIsCheckingAttendance(true);
    try {
      await request.get(ENDPOINT.GET_DRAWING_TODAY);
      toast.info(t.home.alreadyAttended);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setIsMoodModalOpen(true);
      } else {
        setIsMoodModalOpen(true);
      }
    } finally {
      setIsCheckingAttendance(false);
    }
  };

  const handleMoodSelect = (mood: MoodKey) => {
    setIsMoodModalOpen(false);
    router.push(`/diem-danh?mood=${mood}`);
  };

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    } else if (id === "diem-danh") {
      e.preventDefault();
      handleAttendanceClick();
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const toggleLanguageDropdown = () => {
    setIsLanguageOpen(!isLanguageOpen);
    setIsMenuOpen(false);
  };

  const toggleMenuDropdown = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLanguageOpen(false);
  };

  const closeDropdowns = () => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navButtons = [
    { id: "diem-danh", label: t.home.attendance, href: "/diem-danh" },
    { id: "thu-vien", label: t.home.library, href: "/thu-vien" },
    { id: "lich-su-cam-xuc", label: t.home.emotionHistory, href: "/lich-su-cam-xuc" },
  ];

  return {
    // State
    isMuted,
    isMenuOpen,
    isLanguageOpen,
    isLoginModalOpen,
    isMoodModalOpen,
    isAuthenticated,
    language,
    t,

    // Handlers
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

    // Data
    navButtons,
  };
}
