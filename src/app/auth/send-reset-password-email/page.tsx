'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, FormControl, TextField } from '@mui/material';
import { UserService } from '@/services';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordSchema } from './schema';
import { ArrowBack } from '@mui/icons-material';

import './styles.scss';

export default function SendResetPasswordEmail() {
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange'
  });

  const router = useRouter();

  const onSubmit = async (data: ForgotPasswordSchema) => {

    setIsLoading(true);

    try {
      const response = await UserService.sendResetPasswordEmail(data);
      setUser(response.user);

      toast.success('Email de recuperação enviado com sucesso!', { id: 'forgot-password' });

      goBack();
    } catch (error: any) {
      toast.error(error.message || error, { id: 'forgot-password' });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  }

  return (
    <div className="reset-password-container">
      <p className="savings-title styled-title">Savings Challenge</p>
      <FormControl className="form-container">
        <p className="form-title">Recuperar senha</p>
        <TextField
          type="email"
          variant='standard'
          placeholder="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="mb-3 p-2 rounded w-full"
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
              : 'Recuperar senha'
            }
          </Button>
        </div>
      </FormControl>
    </div>
  );
}