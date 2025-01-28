'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, CircularProgress, FormControl, TextField } from '@mui/material';
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
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  });

  const router = useRouter();
  const params = useParams();

  const token = params.token;

  const onSubmit = async (data: ResetPasswordSchema) => {

    setIsLoading(true);

    try {
      const response = await UserService.resetPassword({ ...data, token: token as string });
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
    token ? router.push('/auth/login') : router.back();
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
          placeholder="Nova senha"
          {...register('password')}
          error={!!errors.password || !!passwordError}
          helperText={errors.password?.message || passwordError}
          className="mb-3 p-2 rounded w-full"
          onChange={() => setPasswordError('')}
        />
        <TextField
          type="password"
          variant='standard'
          placeholder="Confirmar nova senha"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
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