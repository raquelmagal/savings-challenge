'use client'

import { useState } from 'react'
import { ClickAwayListener } from '@mui/material';
import { UserService } from '@/services';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AccountCircle, Person, Logout } from '@mui/icons-material';
import { ThemeSelector } from '../ThemeSelector';

import './styles.scss';

export default function HeaderDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const { user, setUser } = useAuth();

  const currentYear = new Date().getFullYear();

  const handleLogout = async () => {
    try {
      await UserService.logoutUser();
      toast.success('Logout realizado com sucesso', { id: 'logout-user' });

      setUser(null);
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.message, { id: 'logout-user' });
    }
  };

  const navigateToResetPassword = () => {
    router.push('/auth/reset-password');
  }

  return (
    <div className='header-dashboard-container'>
      <ThemeSelector />
      <div className='title-container'>
        <p className='title m-0'>Desafio depósitos {currentYear}</p>
      </div>
      <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
        <div className='user-menu-container'>
          <div className='user-container' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <AccountCircle className='user-icon' />
          </div>
          {isMenuOpen && (
            <div className='menu-dropdown'>
              <div className='menu-item' onClick={navigateToResetPassword}>
                <Person />
                <span>{user?.name}</span>
              </div>
              <div className='menu-item' onClick={handleLogout}>
                <Logout />
                <span>Sair</span>
              </div>
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  )
}