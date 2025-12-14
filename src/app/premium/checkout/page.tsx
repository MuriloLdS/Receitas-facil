'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  ArrowLeft, 
  Copy,
  CheckCircle2,
  Clock,
  Loader2,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PremiumPackage {
  id: string;
  name: string;
  months: number;
  price: number;
}

const PREMIUM_PACKAGES: Record<string, PremiumPackage> = {
  'premium-3': { id: 'premium-3', name: 'Trimestral', months: 3, price: 49.90 },
  'premium-6': { id: 'premium-6', name: 'Semestral', months: 6, price: 89.90 },
  'premium-12': { id: 'premium-12', name: 'Anual', months: 12, price: 149.90 }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package') || 'premium-6';
  
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PremiumPackage | null>(null);
  const [pixCode, setPixCode] = useState('');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutos

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/');
          return;
        }

        setUserId(session.user.id);
        
        // Carrega o pacote selecionado
        const pkg = PREMIUM_PACKAGES[packageId];
        if (pkg) {
          setSelectedPackage(pkg);
          // Gera código Pix simulado (em produção, seria gerado pelo gateway de pagamento)
          generatePixCode(pkg);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, [router, packageId]);

  // Timer de expiração do código Pix
  useEffect(() => {
    if (timeRemaining <= 0 || paymentConfirmed) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, paymentConfirmed]);

  const generatePixCode = (pkg: PremiumPackage) => {
    // Em produção, aqui seria feita uma chamada ao gateway de pagamento (Mercado Pago, PagSeguro, etc)
    // Por enquanto, geramos um código simulado
    const mockPixCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}520400005303986540${pkg.price.toFixed(2)}5802BR5925ReceitaFacil Premium6009SAO PAULO62070503***6304`;
    setPixCode(mockPixCode);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success('Código Pix copiado!');
  };

  const checkPaymentStatus = async () => {
    if (!userId || !selectedPackage) return;

    setIsCheckingPayment(true);

    // Simula verificação de pagamento (em produção, consultaria o gateway)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Para demonstração, vamos simular que o pagamento foi confirmado
    // Em produção, isso viria do webhook do gateway de pagamento
    const paymentSuccess = Math.random() > 0.3; // 70% de chance de sucesso na simulação

    if (paymentSuccess) {
      // Calcula data de expiração
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + selectedPackage.months);

      // Salva no localStorage (em produção, salvaria no banco de dados)
      const premiumData = {
        plan: 'premium',
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        months: selectedPackage.months,
        startDate: new Date().toISOString(),
        expirationDate: expirationDate.toISOString(),
        price: selectedPackage.price
      };

      localStorage.setItem('premiumData', JSON.stringify(premiumData));

      setPaymentConfirmed(true);
      toast.success('Pagamento confirmado! Redirecionando...');

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      toast.error('Pagamento ainda não identificado. Aguarde alguns instantes e tente novamente.');
    }

    setIsCheckingPayment(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-4">Pacote não encontrado</h2>
          <Button onClick={() => router.push('/premium')} className="w-full">
            Voltar para Planos
          </Button>
        </Card>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h2>
          <p className="text-gray-600 mb-4">
            Seu plano {selectedPackage.name} foi ativado com sucesso!
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg px-4 py-2">
            <Crown className="w-5 h-5 mr-2" />
            Premium por {selectedPackage.months} meses
          </Badge>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.push('/premium')}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Finalize seu Pagamento
            </h1>
            <p className="text-gray-600">
              Pague via Pix e tenha acesso imediato ao Premium
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Resumo do Pedido */}
            <Card className="p-6 bg-white shadow-lg rounded-2xl h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plano</span>
                  <span className="font-semibold text-gray-900">{selectedPackage.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duração</span>
                  <span className="font-semibold text-gray-900">{selectedPackage.months} meses</span>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    R$ {selectedPackage.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">O que você ganha:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Receitas ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Planejamento semanal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Análise nutricional
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Suporte prioritário
                  </li>
                </ul>
              </div>
            </Card>

            {/* Pagamento Pix */}
            <Card className="p-6 bg-white shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pagamento via Pix</h2>
                {timeRemaining > 0 && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(timeRemaining)}
                  </Badge>
                )}
              </div>

              {timeRemaining > 0 ? (
                <>
                  {/* QR Code Simulado */}
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6">
                    <div className="bg-white rounded-xl p-6 flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-48 h-48 text-gray-800 mx-auto mb-4" />
                        <p className="text-sm text-gray-600">Escaneie o QR Code com seu app de banco</p>
                      </div>
                    </div>
                  </div>

                  {/* Código Pix */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Ou copie o código Pix:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pixCode}
                        readOnly
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono text-gray-700"
                      />
                      <Button
                        onClick={copyPixCode}
                        variant="outline"
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar
                      </Button>
                    </div>
                  </div>

                  {/* Instruções */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Como pagar:</h3>
                    <ol className="space-y-2 text-sm text-blue-800">
                      <li>1. Abra o app do seu banco</li>
                      <li>2. Escolha pagar com Pix QR Code ou Pix Copia e Cola</li>
                      <li>3. Escaneie o QR Code ou cole o código</li>
                      <li>4. Confirme o pagamento</li>
                      <li>5. Clique em "Verificar Pagamento" abaixo</li>
                    </ol>
                  </div>

                  {/* Botão de Verificação */}
                  <Button
                    onClick={checkPaymentStatus}
                    disabled={isCheckingPayment}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isCheckingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verificando pagamento...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Verificar Pagamento
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    O pagamento é processado instantaneamente. Clique em verificar após pagar.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Código Expirado</h3>
                  <p className="text-gray-600 mb-6">
                    O código Pix expirou. Gere um novo código para continuar.
                  </p>
                  <Button
                    onClick={() => {
                      generatePixCode(selectedPackage);
                      setTimeRemaining(600);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  >
                    Gerar Novo Código
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
