'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat, Sparkles, Clock, Crown, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signUp, signIn, resetPassword } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Verifica se usuário já está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        // Recuperação de senha
        const result = await resetPassword(formData.email);
        
        if (result.success) {
          toast.success(result.message);
          setIsForgotPassword(false);
          setIsLogin(true);
        } else {
          toast.error(result.message);
        }
      } else if (isLogin) {
        // Login
        const result = await signIn(formData.email, formData.password);
        
        if (result.success) {
          toast.success(result.message);
          // Aguarda um momento para garantir que a sessão foi criada
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push('/dashboard');
        } else {
          toast.error(result.message);
        }
      } else {
        // Cadastro
        const result = await signUp(formData.email, formData.password, formData.name);
        
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
          }
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && !isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin && !isForgotPassword}
                    disabled={isLoading}
                    className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
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
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400 pr-12"
                      style={{ 
                        WebkitTextSecurity: showPassword ? 'none' : 'disc',
                        color: '#111827'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
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
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
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

            <div className="mt-6 text-center space-y-2">
              {isForgotPassword ? (
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsLogin(true);
                  }}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  Voltar para o login
                </button>
              ) : (
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoading}
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
