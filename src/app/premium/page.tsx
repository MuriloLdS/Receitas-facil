'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Calendar,
  TrendingUp,
  Zap,
  Shield,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PremiumPackage {
  id: string;
  name: string;
  months: number;
  price: number;
  pricePerMonth: number;
  discount: number;
  popular: boolean;
  features: string[];
}

const PREMIUM_PACKAGES: PremiumPackage[] = [
  {
    id: 'premium-3',
    name: 'Trimestral',
    months: 3,
    price: 49.90,
    pricePerMonth: 16.63,
    discount: 10,
    popular: false,
    features: [
      'Receitas ilimitadas por 3 meses',
      'Acesso total ao banco de receitas',
      'Planejamento semanal completo',
      'Suporte prioritário'
    ]
  },
  {
    id: 'premium-6',
    name: 'Semestral',
    months: 6,
    price: 89.90,
    pricePerMonth: 14.98,
    discount: 25,
    popular: true,
    features: [
      'Receitas ilimitadas por 6 meses',
      'Acesso total ao banco de receitas',
      'Planejamento semanal completo',
      'Suporte prioritário',
      'Receitas exclusivas premium',
      'Lista de compras automática'
    ]
  },
  {
    id: 'premium-12',
    name: 'Anual',
    months: 12,
    price: 149.90,
    pricePerMonth: 12.49,
    discount: 40,
    popular: false,
    features: [
      'Receitas ilimitadas por 12 meses',
      'Acesso total ao banco de receitas',
      'Planejamento semanal completo',
      'Suporte prioritário',
      'Receitas exclusivas premium',
      'Lista de compras automática',
      'Análise nutricional avançada',
      'Substituições inteligentes'
    ]
  }
];

export default function PremiumPage() {
  const router = useRouter();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PremiumPackage | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSelectPackage = (pkg: PremiumPackage) => {
    setSelectedPackage(pkg);
    router.push(`/premium/checkout?package=${pkg.id}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Escolha seu Plano Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Acesso ilimitado a receitas personalizadas, planejamento semanal e muito mais. 
              Pague via Pix e comece imediatamente!
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center bg-white shadow-lg rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Receitas Ilimitadas</h3>
              <p className="text-sm text-gray-600">Crie quantas receitas quiser</p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Planejamento Semanal</h3>
              <p className="text-sm text-gray-600">Organize toda sua semana</p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Análise Nutricional</h3>
              <p className="text-sm text-gray-600">Acompanhe suas calorias</p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ativação Instantânea</h3>
              <p className="text-sm text-gray-600">Pague via Pix e use agora</p>
            </Card>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {PREMIUM_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-8 bg-white shadow-lg rounded-3xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  pkg.popular ? 'border-4 border-purple-400' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-bl-2xl text-sm font-semibold">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      R$ {pkg.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      R$ {pkg.pricePerMonth.toFixed(2)}/mês
                    </p>
                    {pkg.discount > 0 && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {pkg.discount}% de desconto
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPackage(pkg)}
                  className={`w-full h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-orange-400 to-pink-600 hover:from-orange-500 hover:to-pink-700 text-white'
                  }`}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar {pkg.name}
                </Button>
              </Card>
            ))}
          </div>

          {/* Trust Section */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg rounded-3xl">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Pagamento Seguro</p>
                  <p className="text-sm text-gray-600">Pix instantâneo e protegido</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Ativação Imediata</p>
                  <p className="text-sm text-gray-600">Use assim que pagar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Sem Compromisso</p>
                  <p className="text-sm text-gray-600">Cancele quando quiser</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
