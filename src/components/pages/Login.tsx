import LoginModal from '@/components/core/modals/LoginModal';
import { useCoreStore } from '@/stores/core-store';
import { useState } from 'react';

export default function Login() {
  const [isOpen, setIsOpen] = useState(true);

  const updateUser = useCoreStore((state) => state.updateUser);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogin = (username: string, password: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    updateUser({ username, password });
    handleClose();
  };

  return (
    <div className="h-screen w-screen">
      <LoginModal isOpen={isOpen} onLogin={handleLogin} />
    </div>
  );
}
