export const QtdNumbersService = {
  async getQtdDeposits(userId: string) {
    const response = await fetch(`/api/qtdNumbers?userId=${userId}`);

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao carregar números');
  
    return data;
  },

  async registerQtdDeposit(userId: string, qtdNumbers: number) {
    const response = await fetch('/api/qtdNumbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, qtdNumbers })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao salvar número');

    return data;
  }
}; 