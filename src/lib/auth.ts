import { supabase } from './supabase';

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
  requiresConfirmation?: boolean;
}

// Login com Google OAuth - CORRIGIDO para evitar erro 403
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    console.log('🔄 Iniciando login com Google...');

    // CORREÇÃO: Removido redirectTo customizado para usar o callback padrão do Supabase
    // Isso evita erro 403 do Google em URLs dinâmicas de preview
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Removido redirectTo - Supabase usa o callback configurado no dashboard
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    console.log('📦 Resposta do signInWithOAuth:', { data, error });

    if (error) {
      console.error('❌ Erro no signInWithOAuth:', error);
      return {
        success: false,
        message: error.message || 'Erro ao fazer login com Google',
        error: error.message,
      };
    }

    console.log('✅ Redirecionando para autenticação Google...');
    return {
      success: true,
      message: 'Redirecionando para o Google...',
    };
  } catch (error) {
    console.error('💥 Erro inesperado no signInWithGoogle:', error);
    return {
      success: false,
      message: 'Erro inesperado ao fazer login com Google',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Cadastro com confirmação de email DESABILITADA para desenvolvimento
export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    // Validação de campos obrigatórios
    if (!email || !password || !name) {
      return {
        success: false,
        message: 'Todos os campos são obrigatórios',
        error: 'MISSING_FIELDS',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres',
        error: 'PASSWORD_TOO_SHORT',
      };
    }

    console.log('🔄 Iniciando cadastro para:', email);

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

    console.log('📦 Resposta do signUp:', { data, error });

    if (error) {
      console.error('❌ Erro no signUp:', error);
      
      // Tratamento específico de erros
      if (error.message.includes('already registered')) {
        return {
          success: false,
          message: 'Este email já está cadastrado. Tente fazer login.',
          error: error.message,
        };
      }

      return {
        success: false,
        message: error.message || 'Erro ao criar conta',
        error: error.message,
      };
    }

    // Se o email foi confirmado automaticamente (configuração do Supabase)
    if (data.session) {
      console.log('✅ Cadastro com sessão criada automaticamente');
      return {
        success: true,
        message: 'Conta criada com sucesso! Redirecionando...',
        requiresConfirmation: false,
      };
    }

    // Se requer confirmação de email
    console.log('📧 Cadastro requer confirmação de email');
    return {
      success: true,
      message: 'Conta criada! Verifique seu email para confirmar o cadastro.',
      requiresConfirmation: true,
    };
  } catch (error) {
    console.error('💥 Erro inesperado no signUp:', error);
    return {
      success: false,
      message: 'Erro inesperado ao criar conta',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Login com tratamento completo de erros
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    // Validação de campos obrigatórios
    if (!email || !password) {
      return {
        success: false,
        message: 'Email e senha são obrigatórios',
        error: 'MISSING_FIELDS',
      };
    }

    console.log('🔄 Tentando login para:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('📦 Resposta do signIn:', { 
      hasSession: !!data?.session, 
      hasUser: !!data?.user,
      error: error?.message 
    });

    if (error) {
      console.error('❌ Erro no signIn:', error);
      
      // Tratamento específico de erros do Supabase
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          message: '📧 Email não confirmado. Verifique sua caixa de entrada e confirme seu cadastro.',
          error: error.message,
        };
      }

      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          message: '❌ Email ou senha incorretos. Verifique seus dados e tente novamente.',
          error: error.message,
        };
      }

      if (error.message.includes('Email not found') || error.message.includes('User not found')) {
        return {
          success: false,
          message: '❌ Email não cadastrado. Crie uma conta primeiro.',
          error: error.message,
        };
      }

      // Erro genérico
      return {
        success: false,
        message: error.message || 'Erro ao fazer login',
        error: error.message,
      };
    }

    // Verifica se a sessão foi criada
    if (!data.session) {
      console.error('⚠️ Login sem sessão criada');
      return {
        success: false,
        message: 'Erro ao criar sessão. Tente novamente.',
        error: 'NO_SESSION_CREATED',
      };
    }

    console.log('✅ Login bem-sucedido!');
    return {
      success: true,
      message: '✅ Login realizado com sucesso!',
    };
  } catch (error) {
    console.error('💥 Erro inesperado no signIn:', error);
    return {
      success: false,
      message: 'Erro inesperado ao fazer login',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Recuperação de senha com redirect correto
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    // Validação de campo obrigatório
    if (!email) {
      return {
        success: false,
        message: 'Email é obrigatório',
        error: 'MISSING_EMAIL',
      };
    }

    console.log('🔄 Solicitando recuperação de senha para:', email);

    // Usa a rota correta /reset-password (não /auth/reset-password)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    console.log('📦 Resposta do resetPassword:', { error });

    if (error) {
      console.error('❌ Erro no resetPassword:', error);
      return {
        success: false,
        message: error.message || 'Erro ao enviar email de recuperação',
        error: error.message,
      };
    }

    console.log('✅ Email de recuperação enviado');
    return {
      success: true,
      message: '📧 Email de recuperação enviado! Verifique sua caixa de entrada.',
    };
  } catch (error) {
    console.error('💥 Erro inesperado no resetPassword:', error);
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
    if (!newPassword) {
      return {
        success: false,
        message: 'Nova senha é obrigatória',
        error: 'MISSING_PASSWORD',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres',
        error: 'PASSWORD_TOO_SHORT',
      };
    }

    console.log('🔄 Atualizando senha...');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    console.log('📦 Resposta do updatePassword:', { error });

    if (error) {
      console.error('❌ Erro no updatePassword:', error);
      return {
        success: false,
        message: error.message || 'Erro ao atualizar senha',
        error: error.message,
      };
    }

    console.log('✅ Senha atualizada com sucesso');
    return {
      success: true,
      message: '✅ Senha atualizada com sucesso!',
    };
  } catch (error) {
    console.error('💥 Erro inesperado no updatePassword:', error);
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
    console.log('🔄 Fazendo logout...');

    const { error } = await supabase.auth.signOut();

    console.log('📦 Resposta do signOut:', { error });

    if (error) {
      console.error('❌ Erro no signOut:', error);
      return {
        success: false,
        message: 'Erro ao fazer logout',
        error: error.message,
      };
    }

    console.log('✅ Logout realizado');
    return {
      success: true,
      message: '✅ Logout realizado com sucesso!',
    };
  } catch (error) {
    console.error('💥 Erro inesperado no signOut:', error);
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
    if (!email) {
      return {
        success: false,
        message: 'Email é obrigatório',
        error: 'MISSING_EMAIL',
      };
    }

    console.log('🔄 Reenviando email de confirmação para:', email);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    console.log('📦 Resposta do resend:', { error });

    if (error) {
      console.error('❌ Erro no resend:', error);
      return {
        success: false,
        message: error.message || 'Erro ao reenviar email de confirmação',
        error: error.message,
      };
    }

    console.log('✅ Email reenviado');
    return {
      success: true,
      message: '📧 Email de confirmação reenviado! Verifique sua caixa de entrada.',
    };
  } catch (error) {
    console.error('💥 Erro inesperado no resend:', error);
    return {
      success: false,
      message: 'Erro ao reenviar email',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
