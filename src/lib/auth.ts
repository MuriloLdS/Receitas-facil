import { supabase } from './supabase';

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
  requiresConfirmation?: boolean;
}

// Cadastro com confirmação de email DESABILITADA para desenvolvimento
export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      return {
        success: false,
        message: 'Erro ao criar conta',
        error: error.message,
      };
    }

    // Se o email foi confirmado automaticamente (configuração do Supabase)
    if (data.session) {
      return {
        success: true,
        message: 'Conta criada com sucesso! Redirecionando...',
        requiresConfirmation: false,
      };
    }

    // Se requer confirmação de email
    return {
      success: true,
      message: 'Conta criada! Verifique seu email para confirmar o cadastro.',
      requiresConfirmation: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro inesperado ao criar conta',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Login
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          message: 'Email não confirmado. Verifique sua caixa de entrada.',
          error: error.message,
        };
      }
      return {
        success: false,
        message: 'Email ou senha incorretos',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Login realizado com sucesso!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao fazer login',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Recuperação de senha
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        message: 'Erro ao enviar email de recuperação',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Email de recuperação enviado! Verifique sua caixa de entrada.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao solicitar recuperação de senha',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Atualizar senha (após clicar no link do email)
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        message: 'Erro ao atualizar senha',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Senha atualizada com sucesso!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao atualizar senha',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Logout
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: 'Erro ao fazer logout',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Logout realizado com sucesso!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao fazer logout',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Reenviar email de confirmação
export async function resendConfirmationEmail(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      return {
        success: false,
        message: 'Erro ao reenviar email de confirmação',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Email de confirmação reenviado! Verifique sua caixa de entrada.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao reenviar email',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
