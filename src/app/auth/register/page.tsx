'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, FormControl, Link, TextField } from '@mui/material';
import { UserService } from '@/services';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, registerSchema } from './schema';

import './styles.scss';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {

    setIsLoading(true);

    try {
      await UserService.registerUser(data).then(() => {
        toast.success('Cadastro realizado com sucesso!', { id: 'register-user' });
        router.push('/auth/login');
      });
    } catch (error: any) {
      toast.error(error.message || error, { id: 'register-user' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <p className="savings-title">Savings Challenge</p>
      <FormControl className="form-container">
        <p className="title">Cadastro</p>
        <TextField
          type="text"
          variant='standard'
          placeholder="Nome"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="mb-3 p-2 rounded w-full"
        />
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
        <span className="login-wrapper mb-5 p-2">Já tem uma conta?
          <Link href="/auth/login" className="login-link body-s-bold">Entrar</Link>
        </span>
        <Button
          type="submit"
          className="w-full p-2 rounded button-container"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isValid || !isDirty}
        >
          {isLoading 
            ? <CircularProgress size={24} className="loading-spinner" />
            : 'Cadastrar'
          }
        </Button>
      </FormControl>
    </div>
  );
}