'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Verifica se há um hash na URL (confirmação de email)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken) {
          // Email confirmado com sucesso
          toast.success('Email confirmado com sucesso! Você já pode fazer login.');
          router.push('/');
        } else if (type === 'recovery' && accessToken) {
          // Recuperação de senha
          router.push('/auth/reset-password');
        } else {
          // Verifica sessão atual
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            toast.success('Autenticação realizada com sucesso!');
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        toast.error('Erro ao processar autenticação');
        router.push('/');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto" />
        <p className="text-gray-600 text-lg">Processando autenticação...</p>
      </div>
    </div>
  );
}
