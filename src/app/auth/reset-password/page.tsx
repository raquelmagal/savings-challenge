'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, FormControl, Link, TextField } from '@mui/material';
import { UserService } from '@/services';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, resetPasswordSchema } from './schema';
import { ArrowBack } from '@mui/icons-material';

import './styles.scss';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { user, setUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema(!!user)),
    mode: 'onChange'
  });

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordSchema) => {

    setIsLoading(true);

    try {
      const response = !!user ? await UserService.resetPassword(data) : await UserService.forgotPassword(data);
      setUser(response.user);

      toast.success('Senha atualizada com sucesso!', { id: 'reset-password' });

      goBack();
    } catch (error: any) {
      if (error.message === 'Senha atual incorreta') {
        setPasswordError(error.message);
      } else {
        toast.error(error.message || error, { id: 'reset-password' });
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
          type="email"
          variant='standard'
          placeholder="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="mb-3 p-2 rounded w-full"
        />
        {
          !!user && (
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
          )
        }
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