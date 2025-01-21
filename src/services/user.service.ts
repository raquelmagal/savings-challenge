interface UserRegister {
  name: string;
  email: string;
  password: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserResetPassword {
  email: string;
  password?: string;
  newPassword: string;
}

interface UserForgotPassword {
  email: string;
  newPassword: string;
}

export const UserService = {
  async registerUser(user: UserRegister) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário, tente novamente');
      }

      return data;

    } catch (error) {
      throw error;
    }
  },

  async removeUser(userId: string) {
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) throw new Error('Erro ao deletar usuário, tente novamente');

    return response.json();
  },

  async loginUser(user: UserLogin) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login, tente novamente');
      }

      return data;

    } catch (error) {
      throw error;
    }
  },

  async logoutUser() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer logout, tente novamente');
      }

      return data;

    } catch (error) {
      throw error;
    }
  },

  async checkSession() {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;

    } catch (error) {
      throw error;
    }
  },

  async resetPassword(user: UserResetPassword) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar senha, tente novamente');
      }

      return data;

    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(user: UserForgotPassword) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar senha, tente novamente');
      }

      return data;

    } catch (error) {
      throw error;
    }
  },
};