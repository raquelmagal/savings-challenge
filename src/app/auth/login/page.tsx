'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, FormControl, Link, TextField } from '@mui/material';
import { UserService } from '@/services';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, loginSchema } from './schema';

import './styles.scss';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const { setUser } = useAuth();

  const router = useRouter();

  const onSubmit = async (data: LoginSchema) => {

    setIsLoading(true);

    try {
      const response = await UserService.loginUser(data);
      setUser(response.user);

      toast.success('Login realizado com sucesso!', { id: 'login-user' });

      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || error, { id: 'login-user' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <p className="savings-title">Savings Challenge</p>
      <FormControl className="form-container">
        <p className="form-title">Login</p>
        <TextField
          type="email"
          variant='standard'
          placeholder="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="mb-3 p-2 rounded w-full"
        />
        <TextField
          type="password"
          variant='standard'
          placeholder="Senha"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          className="mb-3 p-2 rounded w-full"
        />
        <span className="tip-wrapper p-2">
          <Link href="/auth/send-reset-password-email" className="tip-link body-s-bold">Esqueci minha senha</Link>
        </span>
        <span className="tip-wrapper mb-5 p-2">Não tem uma conta?
          <Link href="/auth/register" className="tip-link body-s-bold">Cadastre-se</Link>
        </span>
        <Button
          type="submit"
          className="w-full p-2 rounded button-container"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isValid || !isDirty}
        >
          {isLoading 
            ? <CircularProgress size={24} className="loading-spinner" />
            : 'Entrar'
          }
        </Button>
      </FormControl>
    </div>
  );
}