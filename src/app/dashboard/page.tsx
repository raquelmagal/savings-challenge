'use client';

import HeaderDashboard from '@/app/components/HeaderDashboard';
import NumberGrid from '@/app/components/NumberGrid';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

import './styles.scss';

export default function Vault() {

  const { user } = useAuth();
  const { setCurrentPalette } = useTheme();

  useEffect(() => {
    if (!user) return;

    setCurrentPalette(user.theme || 'default');
  }, [user]);

  return (
    <main className='h-100 w-100 d-flex flex-column align-items-center justify-content-center'>
      {
        !user?.theme 
        ? <>
            <div className='loading-container'>
              <CircularProgress className='loading-spinner' /> 
            </div>
          </>
        : <>
            <HeaderDashboard />
            <NumberGrid />
          </>
      }
    </main>
  )
}