'use client';

import { themeColors } from '@/app/constants/themeColors';
import { ThemePalette, useTheme } from '@/contexts/ThemeContext';
import { ThemeSelectorService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

import './styles.scss';

export function ThemeSelector() {
  const { user } = useAuth();
  const { currentPalette, setCurrentPalette } = useTheme();

  const handleThemeChange = async (theme: ThemePalette) => {
    if (!user?._id) return;

    try {
      await ThemeSelectorService.registerTheme(user?._id, theme);
      setCurrentPalette(theme);
      toast.success('Tema alterado com sucesso!', { id: 'theme-selector' });

    } catch (error) {
      toast.error('Erro ao alterar tema!', { id: 'theme-selector' });
    }
  };

  return (
    <div className='theme-selector-container'>
      {themeColors.map((theme) => (
        <div
          className={`theme-circle theme-${theme.name} ${currentPalette === theme.name ? 'active' : ''}`}
          key={theme.name}
          onClick={() => handleThemeChange(theme.name as ThemePalette)}
        >
        </div>
      ))}
    </div>
  );
}