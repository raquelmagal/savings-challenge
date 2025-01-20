'use client'

import { useEffect, useMemo, useState } from 'react'
import { FormControl, InputLabel, MenuItem, SelectChangeEvent } from '@mui/material';
import { Select } from '@mui/material';
import { QtdNumbersService, NumberService } from '@/services';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/format';

import './styles.scss';

export default function NumberGrid() {
  const [qtd, setQtd] = useState<number>(250);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const { user } = useAuth();

  const router = useRouter();

  const loadNumbers = async () => {
    if (!user) return;

    try {
      toast.loading('Carregando valores...', { id: 'loading-numbers' });

      const userData = await NumberService.getUserDeposits(user?._id);

      setSelectedNumbers(userData.selected_numbers.map((item: any) => item.number));
      setQtd(userData.qtdNumbers);

      toast.success('Valores carregados com sucesso!', { id: 'loading-numbers' });
    } catch (error) {
      toast.error('Erro ao carregar valores', { id: 'loading-numbers' });
    }
  };

  const handleQtdChange = async (event: SelectChangeEvent<number>) => {
    if (!user) return;

    const qtdNumbers = Number(event.target.value);
    setQtd(qtdNumbers);

    const numbersToRemove = selectedNumbers.filter((number: number) => {
      return number > qtdNumbers;
    });

    try {
      await QtdNumbersService.registerQtdDeposit(user._id, qtdNumbers);
      toast.success('Quantidade atualizada com sucesso!', { id: 'qtd-numbers' });
    } catch (error) {
      toast.error('Erro ao atualizar quantidade, tente novamente.', { id: 'qtd-numbers' });
    }

    try {
      for (const number of numbersToRemove) {
        await NumberService.removeDeposit(user._id, number);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setSelectedNumbers(prev => prev.filter(num => num <= qtdNumbers));

      if (numbersToRemove.length) toast.success('Valores atualizados com sucesso!', { id: 'remove-numbers' });
  
    } catch (error) {
      toast.error('Erro ao remover valores, tente novamente.', { id: 'remove-numbers' });
    }
  }

  const handleNumberClick = async (num: number) => {
    if (!user) return;

    if (!selectedNumbers.includes(num)) {
      await NumberService.registerDeposit(user._id, num);
      setSelectedNumbers((prev) => [...prev, num]);

      toast.success('Valor adicionado com sucesso!', { id: 'add-number' });
    } else {
      await NumberService.removeDeposit(user._id, num);
      setSelectedNumbers((prev) => prev.filter(n => n !== num));

      toast.success('Valor removido com sucesso!', { id: 'remove-number' });
    }
  }

  const totalSum = useMemo(() => {
    return selectedNumbers.reduce((sum, number) => sum + number, 0);
  }, [selectedNumbers]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }

    loadNumbers();
  }, []);

  return (
    <div className='number-grid-container'>
      <div className='number-grid-header'>
        <FormControl className='qtd-form-control'>
          <InputLabel id="quantidade-label">Quantidade</InputLabel>
          <Select
            labelId="quantidade-label"
            id="quantidade-select"
            value={qtd}
            label="Quantidade"
            onChange={handleQtdChange}
          >
            <MenuItem value={50}>50 números</MenuItem>
            <MenuItem value={100}>100 números</MenuItem>
            <MenuItem value={150}>150 números</MenuItem>
            <MenuItem value={200}>200 números</MenuItem>
            <MenuItem value={250}>250 números</MenuItem>
          </Select>
        </FormControl>
        <div className='total-sum'>
          <span className='body-l-bold sum-text'>Valor depositado: {formatCurrency(totalSum)}</span>
        </div>
      </div>
      <div className='grid'>
        {Array.from({ length: qtd }, (_, i) => i + 1).map((number) => (
          <div
            key={number}
            onClick={() => handleNumberClick(number)}
            className={`number ${selectedNumbers.includes(number) ? 'selected' : ''}`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  )
}