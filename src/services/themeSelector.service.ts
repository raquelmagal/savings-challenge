export const ThemeSelectorService = {
  async getTheme(userId: string) {
    const response = await fetch(`/api/themeSelector?userId=${userId}`);

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao carregar tema');
  
    return data;
  },

  async registerTheme(userId: string, theme: string) {
    const response = await fetch('/api/themeSelector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, theme })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erro ao salvar tema');

    return data;
  }
}; 