export const NumberService = {
  async getUserDeposits(userId: string) {
    const response = await fetch(`/api/numbers?userId=${userId}`);

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao carregar números');
  
    return data;
  },

  async registerDeposit(userId: string, number: number) {
    const response = await fetch('/api/numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, number })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao salvar número');

    return data;
  },

  async removeDeposit(userId: string, number: number) {
    const response = await fetch('/api/numbers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, number })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao remover número');

    return data;
  }
}; 