'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, FormControl, TextField } from '@mui/material';
import { UserService } from '@/services';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordSchema, changePasswordSchema } from './schema';
import { ArrowBack } from '@mui/icons-material';

import './styles.scss';

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { user, setUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange'
  });

  const router = useRouter();

  const onSubmit = async (data: ChangePasswordSchema) => {

    setIsLoading(true);

    try {
      if (!user) {
        toast.error('Erro, usuário não encontrado. Faça login novamente.', { id: 'change-password' });
        router.push('/auth/login');
        return;
      }

      const response = await UserService.changePassword({...data, email: user.email});
      setUser(response.user);

      toast.success('Senha atualizada com sucesso!', { id: 'change-password' });

      goBack();
    } catch (error: any) {
      if (error.message === 'Senha atual incorreta') {
        setPasswordError(error.message);
      } else {
        toast.error(error.message || error, { id: 'change-password' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  }

  return (
    <div className="reset-password-container">
      <p className={`savings-title styled-title ${user?.name ? 'mb-3' : ''}`}>Savings Challenge</p>
      {
        user && (
          <p className="mb-5 subtitle-m">{user.name}</p>
        )
      }
      <FormControl className="form-container">
        <p className="form-title">Atualizar senha</p>
        <TextField
          type="password"
          variant='standard'
          placeholder="Senha atual"
          {...register('password')}
          error={!!errors.password || !!passwordError}
          helperText={errors.password?.message || passwordError}
          className="mb-3 p-2 rounded w-full"
          onChange={() => setPasswordError('')}
        />
        <TextField
          type="password"
          variant='standard'
          placeholder="Nova senha"
          {...register('newPassword')}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          className="mb-5 p-2 rounded w-full"
        />
        <div className="d-flex align-items-center justify-content-between p-2">
          <span className="tip-wrapper">
            <ArrowBack onClick={goBack} className="cursor-pointer" />
          </span>
          <Button
            type="submit"
            className="w-full p-2 rounded button-container"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || !isValid || !isDirty}
          >
            {isLoading
              ? <CircularProgress size={24} className="loading-spinner" />
              : 'Atualizar senha'
            }
          </Button>
        </div>
      </FormControl>
    </div>
  );
}