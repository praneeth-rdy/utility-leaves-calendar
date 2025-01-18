import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ProfileModal from './modals/ProfileModal';
import { useCoreStore } from '@/stores/core-store';
import { ChartLine } from 'lucide-react';
import LeavesAnalyticsModal from './modals/LeavesAnalyticsModal';

export default function AccessWrapper(props: AccessWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLeavesAnalyticsModalOpen, setIsLeavesAnalyticsModalOpen] = useState(false);

  const isLeavesLoading = useCoreStore((state) => state.isLeavesLoading);
  const isHolidaysLoading = useCoreStore((state) => state.isHolidaysLoading);

  const allowAccess = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const openLeavesAnalyticsModal = () => {
    setIsLeavesAnalyticsModalOpen(true);
  };

  const closeLeavesAnalyticsModal = () => {
    setIsLeavesAnalyticsModalOpen(false);
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
      allowAccess();
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={allowAccess} />;
  }

  return (
    <div className="relative">
      {!isLeavesLoading && !isHolidaysLoading && (
        <div className="absolute top-2.5 sm:top-3.5 right-4 sm:right-24 z-50 cursor-pointer flex items-center gap-3">
          <div onClick={openLeavesAnalyticsModal} className="hidden sm:flex sm:items-center sm:justify-center p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors shadow-sm">
            <ChartLine size={18} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <Avatar className="size-8 ring-2 ring-offset-2 ring-zinc-100 dark:ring-zinc-800 hover:ring-zinc-200 dark:hover:ring-zinc-700 transition-colors" onClick={openProfileModal}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>Profile</AvatarFallback>
          </Avatar>
        </div>
      )}
      {props.children}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} onLogout={logout} />
      <LeavesAnalyticsModal isOpen={isLeavesAnalyticsModalOpen} onClose={closeLeavesAnalyticsModal} />
    </div>
  );
}

type AccessWrapperProps = {
  children: React.ReactNode;
};
