'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat, Sparkles, Clock, Crown, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { signUp, signIn, resetPassword, signInWithGoogle } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Verifica se usuário já está autenticado
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          router.push('/dashboard');
        }
      } catch (error) {
        // Ignora erros de rede durante navegação/redirecionamento
        if (isMounted && error instanceof Error && !error.message.includes('aborted')) {
          console.error('Erro ao verificar autenticação:', error);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    // Suprime erro do ResizeObserver
    const resizeObserverErrorHandler = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
        return true;
      }
      return false;
    };

    window.addEventListener('error', resizeObserverErrorHandler);

    return () => {
      isMounted = false;
      abortController.abort();
      window.removeEventListener('error', resizeObserverErrorHandler);
    };
  }, [router]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');

    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        setErrorMessage(result.message);
        toast.error(result.message);
        setIsGoogleLoading(false);
      }
      // Se sucesso, o usuário será redirecionado automaticamente pelo OAuth
      // Mantém loading até o redirect acontecer
    } catch (error) {
      console.error('💥 Erro inesperado no login Google:', error);
      const errorMsg = 'Erro ao conectar com Google. Tente novamente.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Limpa mensagem de erro anterior

    try {
      if (isForgotPassword) {
        // Recuperação de senha
        console.log('🔄 Iniciando recuperação de senha...');
        const result = await resetPassword(formData.email);
        
        console.log('📦 Resultado da recuperação:', result);
        
        if (result.success) {
          toast.success(result.message);
          setIsForgotPassword(false);
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        } else {
          setErrorMessage(result.message);
          toast.error(result.message);
        }
      } else if (isLogin) {
        // Login
        console.log('🔄 Iniciando login...');
        const result = await signIn(formData.email, formData.password);
        
        console.log('📦 Resultado do login:', result);
        
        if (result.success) {
          toast.success(result.message);
          // Aguarda um momento para garantir que a sessão foi criada
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push('/dashboard');
        } else {
          // Exibe erro visualmente na tela E no toast
          setErrorMessage(result.message);
          toast.error(result.message);
          console.error('❌ Falha no login:', result.error);
        }
      } else {
        // Cadastro
        console.log('🔄 Iniciando cadastro...');
        const result = await signUp(formData.email, formData.password, formData.name);
        
        console.log('📦 Resultado do cadastro:', result);
        
        if (result.success) {
          // Se não requer confirmação (auto-confirmado), redireciona direto
          if (!result.requiresConfirmation) {
            toast.success(result.message);
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/dashboard');
          } else {
            // Se requer confirmação, mostra mensagem e volta pro login
            toast.success(result.message, {
              description: 'Verifique seu email para confirmar o cadastro antes de fazer login.',
              duration: 6000,
            });
            setIsLogin(true);
            setFormData({ name: '', email: '', password: '' });
          }
        } else {
          // Exibe erro visualmente na tela E no toast
          setErrorMessage(result.message);
          toast.error(result.message);
          console.error('❌ Falha no cadastro:', result.error);
        }
      }
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      const errorMsg = 'Erro inesperado. Tente novamente.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              ReceitaFácil
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Crie receitas incríveis com o que você tem em casa
              </h1>
              <p className="text-xl text-gray-600">
                Selecione seus ingredientes e descubra receitas personalizadas para cada refeição do dia
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receitas Personalizadas</h3>
                  <p className="text-gray-600 text-sm">
                    IA cria receitas baseadas nos seus ingredientes disponíveis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Rápido e Fácil</h3>
                  <p className="text-gray-600 text-sm">
                    Receitas práticas para café, almoço e jantar em segundos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Planos Flexíveis</h3>
                  <p className="text-gray-600 text-sm">
                    Comece grátis com 3 receitas ou tenha acesso ilimitado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Cadastro/Recuperação */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isForgotPassword 
                  ? 'Recuperar senha' 
                  : isLogin 
                  ? 'Bem-vindo de volta!' 
                  : 'Crie sua conta'}
              </h2>
              <p className="text-gray-600">
                {isForgotPassword
                  ? 'Digite seu email para receber o link de recuperação'
                  : isLogin 
                  ? 'Entre para continuar criando receitas' 
                  : 'Comece grátis agora mesmo'}
              </p>
            </div>

            {/* Mensagem de erro visível */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && !isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrorMessage(''); // Limpa erro ao digitar
                    }}
                    required={!isLogin && !isForgotPassword}
                    disabled={isLoading || isGoogleLoading}
                    className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400 text-[#000000]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrorMessage(''); // Limpa erro ao digitar
                  }}
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400 text-[#000000]"
                />
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrorMessage(''); // Limpa erro ao digitar
                      }}
                      required
                      disabled={isLoading || isGoogleLoading}
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400 pr-12 text-[#000000]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || isGoogleLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && !isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorMessage('');
                    }}
                    disabled={isGoogleLoading}
                    className="text-sm text-orange-600 hover:text-orange-700 transition-colors disabled:opacity-50"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full h-12 bg-gradient-to-r from-orange-400 to-pink-600 hover:from-orange-500 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : isForgotPassword ? (
                  'Enviar link de recuperação'
                ) : isLogin ? (
                  'Entrar'
                ) : (
                  'Criar conta grátis'
                )}
              </Button>
            </form>

            {/* Divisor "ou" */}
            {(isLogin || !isForgotPassword) && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>
            )}

            {/* Botão Google */}
            {(isLogin || !isForgotPassword) && (
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
                  </>
                )}
              </Button>
            )}

            <div className="mt-6 text-center space-y-2">
              {isForgotPassword ? (
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsLogin(true);
                    setErrorMessage('');
                  }}
                  disabled={isLoading || isGoogleLoading}
                  className="text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  Voltar para o login
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMessage('');
                  }}
                  disabled={isLoading || isGoogleLoading}
                  className="text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                </button>
              )}
            </div>

            {!isLogin && !isForgotPassword && (
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
                <p className="text-sm text-gray-600 text-center">
                  🎁 <strong>Plano Grátis:</strong> 3 receitas por dia<br />
                  ⭐ <strong>Premium:</strong> Receitas ilimitadas por R$ 19,90/mês
                </p>
              </div>
            )}

            {!isLogin && !isForgotPassword && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-800 text-center">
                  📧 Você receberá um email de confirmação após o cadastro
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
